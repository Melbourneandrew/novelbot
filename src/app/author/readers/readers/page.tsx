"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function AuthorReadersView() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch("/api/author/readers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: "This is some data",
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }

    const data = await response.json();
    console.log(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="text-left">Your Readers</h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Chats</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="hover">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr className="hover">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr className="hover">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
