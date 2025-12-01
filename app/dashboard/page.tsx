"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Stock = {
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  exchangeName: string;
  currentMarketPrice: number;
  peRatio: number;
  latestEarning: number;
};

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();

    const interval = setInterval(() => {
      updatePrices();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get(
        "https://octabyte-server.onrender.com/api/dashboard"
      );
      setStocks(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  const updatePrices = async () => {
    try {
      const res = await axios.get(
        "https://octabyte-server.onrender.com/api/dashboard/update"
      );
      const updatedPrices = res.data.data;

      setStocks((prev) =>
        prev.map((stock) => {
          const found = updatedPrices.find(
            (s: any) => s.symbol === stock.symbol
          );
          return found
            ? { ...stock, currentMarketPrice: found.currentMarketPrice }
            : stock;
        })
      );
    } catch (err) {
      console.error("Price update failed:", err);
    }
  };

  const sellStock = async (symbol: string) => {
    try {
      await axios.post("https://octabyte-server.onrender.com/api/sell", {
        symbol,
      });
      fetchPortfolio();
    } catch (err) {
      console.error("Error selling stock:", err);
    }
  };

  if (loading) return <p className="text-black">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-xl font-bold mb-4">Your Portfolio</h1>

      <table className="w-full border-collapse shadow-md rounded">
        <thead>
          <tr className="bg-gray-100 text-gray-800 border-b">
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Purchase Price</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Market Price</th>
            <th className="p-3 text-left">P/L ($)</th>
            <th className="p-3 text-left">P/E</th>
            <th className="p-3 text-left">Earnings</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => {
            const profitLoss =
              (stock.currentMarketPrice - stock.purchasePrice) * stock.quantity;

            const isProfit = profitLoss >= 0;

            return (
              <tr
                key={stock.symbol}
                className="border-b hover:bg-gray-50 text-black"
              >
                <td className="p-3 font-semibold">{stock.symbol}</td>
                <td className="p-3">{stock.name}</td>
                <td className="p-3">${stock.purchasePrice}</td>
                <td className="p-3">{stock.quantity}</td>

                <td
                  className={`p-3 font-bold ${
                    isProfit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${stock.currentMarketPrice}
                </td>

                <td
                  className={`p-3 font-bold ${
                    isProfit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isProfit ? "+" : ""}
                  {profitLoss.toFixed(2)}
                </td>

                <td className="p-3">{stock.peRatio}</td>
                <td className="p-3">{stock.latestEarning}</td>

                <td className="p-3">
                  <button
                    onClick={() => sellStock(stock.symbol)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Sell
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
