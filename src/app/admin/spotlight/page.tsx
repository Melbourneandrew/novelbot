"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
export default function SpotlightPage() {
  const documentType = useSearchParams().get("doc");
  const id = useSearchParams().get("id");
  const [document, setDocument] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/admin/spotlight?doc=${documentType}&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setDocument(data.document);
      });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1>{documentType}</h1>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </div>
  );
}
