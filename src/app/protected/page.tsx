"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function StarterTemplateView() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const response = await fetch("/api/route/here", {
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
      {isLoading ? <LoadingIndicator /> : <p>This is some content</p>}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
