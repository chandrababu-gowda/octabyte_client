"use client";

import "antd/dist/reset.css";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-black">Stock App</h1>

        <nav className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className={`px-4 py-2 rounded hover:bg-gray-100 text-black ${
              pathname === "/dashboard" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/purchase"
            className={`px-4 py-2 rounded hover:bg-gray-100 text-black ${
              pathname === "/purchase" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            Purchase Stocks
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 text-black">{children}</main>
    </div>
  );
}
