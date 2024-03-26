"use client"
import { useState } from "react";
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const route = pathname.split('/');
  const currentTab = route[route.length - 1]
  console.log(currentTab)
  const [activeTab, setActiveTab] = useState("");
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className={`tab ${currentTab === "recent" ? "tab-active" : ""}`} onClick={() => setActiveTab("recent")} href="recent">
          Recent
        </a>
        <a role="tab" className={`tab ${currentTab === "admin-users" ? "tab-active" : ""}`} onClick={() => setActiveTab("admin users")} href="admin-users">
          Admin Users
        </a>
        <a role="tab" className={`tab ${currentTab === "db-controls" ? "tab-active" : ""}`} onClick={() => setActiveTab("database")} href="db-controls">
          Database
        </a>
      </div>
      <div className="flex flex-col px-[50px] pt-[30px]">
        {children}
      </div>

    </div>
  );
}
