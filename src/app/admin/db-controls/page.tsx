"use client";
import { useState, useEffect, use } from "react";

interface Collection {
  name: string;
  count: number;
}
export default function DbControls() {
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = async () => {
    const response = await fetch("/api/admin/tables");
    const data = await response.json();
    console.log(data);
    setCollections(data);
  };
  const deleteCollection = async (collection: Collection) => {
    const response = await fetch("/api/admin/tables", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionName: collection.name,
      }),
    });
    if (response.status === 200) {
      getCollections();
    }
    console.log("Delete request response: ", response);
  };
  useEffect(() => {
    getCollections();
  }, []);
  return (
    <div>
      <h2 className="text-left">Database collections</h2>
      <div className="flex flex-wrap gap-1 mt-[10px] m-atuo w-[100%]">
        {collections.map((collection: Collection, index: number) => (
          <div
            className="card w-96 bg-base-100 shadow-xl w-[300px]"
            key={index}
          >
            <div className="card-body">
              <h2 className="card-title">{collection.name}</h2>
              <p>{collection.count} records</p>
              <div className="card-actions justify-end">
                <button className="btn btn">View</button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteCollection(collection)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
