"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthorReadersView({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("");
  const pathname = usePathname();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (pathname.split("/").pop() === "readers") {
      setActiveTab("readers");
    } else if (pathname.split("/").pop() === "codes") {
      setActiveTab("access-codes");
    }
  }, [pathname]);

  return (
    <div>
      <div role="tablist" className="tabs tabs-bordered">
        <a
          href="/author/readers/readers"
          role="tab"
          className={activeTab === "readers" ? "tab tab-active" : "tab"}
          onClick={() => handleTabClick("readers")}
        >
          Readers
        </a>
        <a
          href="/author/readers/codes"
          role="tab"
          className={activeTab === "access-codes" ? "tab tab-active" : "tab"}
          onClick={() => handleTabClick("access-codes")}
        >
          Access Codes
        </a>
      </div>
      {children}
    </div>
  );
}
