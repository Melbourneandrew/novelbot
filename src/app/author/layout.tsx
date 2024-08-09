"use client";
import { ReactNode } from "react";

export default function DashboardNavbarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <h1 className="text-4xl mb-[20px] text-left">Author Dashboard</h1>

      <div className="flex flex-row">
        {/* SIDE NAV BAR */}
        <div className="flex flex-col items-center h-screen border border-1 rounded p-[15px] mr-[20px]">
          {/* <h1 className="text-2xl mb-[15px]">Dashboard</h1> */}
          <a
            href="/author"
            className="py-2 border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            🏠 Home
          </a>
          <a
            href="/author/books"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            📚 Books
          </a>
          <a
            href="/author/characters"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            👬 Characters
          </a>
          <a
            href="/author/readers/list"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            👓 Readers
          </a>
          <a
            href="/author/access-codes"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            🔐 Access Codes
          </a>
          <a
            href="/author/conversations"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            💬 Conversations
          </a>
          <a
            href="/author/settings"
            className="py-2 border-t border-b text-left w-[100%] text-xl no-underline hover:bg-gray-200"
          >
            ⚙️ Settings
          </a>
        </div>
        {/* CONTENT */}
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
