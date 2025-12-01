"use client";

import { useState } from "react";
import { Input, Table, Button, InputNumber, message } from "antd";

interface ApiResponse {
  symbol: string;
  name: string;
  exchangeName: string;
  currentMarketPrice: number;
}

export default function PurchasePage() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://octabyte-server.onrender.com/api/purchase?stock=${searchText}`
      );
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        message.error("Stock not found");
      }
    } catch (err) {
      message.error("Error fetching data");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!data) return;
    if (!quantity || quantity <= 0) {
      return message.warning("Enter a valid quantity");
    }

    try {
      const res = await fetch(
        "https://octabyte-server.onrender.com/api/purchase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: data.symbol,
            name: data.name,
            price: data.currentMarketPrice,
            quantity: quantity,
            exchangeName: data.exchangeName,
          }),
        }
      );

      if (res.ok) {
        message.success("Order placed successfully!");
      } else {
        message.error("Order failed");
      }
    } catch (err) {
      message.error("Error submitting order");
    }
  };

  const tableData = data
    ? [
        {
          key: data.symbol,
          ...data,
        },
      ]
    : [];

  const columns = [
    { title: "Symbol", dataIndex: "symbol" },
    { title: "Name", dataIndex: "name" },
    { title: "Exchange", dataIndex: "exchangeName" },
    { title: "Current Price", dataIndex: "currentMarketPrice" },

    {
      title: "Quantity",
      render: () => (
        <InputNumber
          min={1}
          value={quantity ?? undefined}
          onChange={(value) => setQuantity(Number(value))}
        />
      ),
    },

    {
      title: "Action",
      render: () => (
        <Button
          className="!bg-green-600 !text-white hover:!bg-green-700 !border-none"
          type="primary"
          onClick={handleSubmit}
        >
          Purchase
        </Button>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Purchase Stock</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Enter stock symbol..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />
        <Button type="primary" loading={loading} onClick={handleSearch}>
          Search
        </Button>
      </div>

      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        bordered
        rowClassName={() => "bg-gray-50 hover:bg-gray-100 text-black"}
        className="bg-white"
        scroll={{ x: true }}
      />
    </div>
  );
}
