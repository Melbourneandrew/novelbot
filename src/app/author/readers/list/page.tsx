"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { IReader } from "@/lib/models/Reader";
import ErrorMessage from "@/components/ErrorMessage";

export default function AuthorReadersView() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [readers, setReaders] = useState<IReader[]>([] as IReader[]);

  const fetchReaders = async () => {
    setIsLoading(true);
    const response = await fetch("/api/author/readers/list");
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data);
    setReaders(data.readers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReaders();
  }, []);
  return (
    <div>
      <h1 className="text-left">Your Readers</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
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
              {readers.map((reader, index) => (
                <tr
                  key={index}
                  className="hover cursor-pointer"
                  onClick={() =>
                    (window.location.href =
                      "/author/readers/single?readerId=" +
                      reader._id.toString())
                  }
                >
                  <th>{index + 1}</th>
                  <td>{reader.displayName}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        (window.location.href =
                          "/author/conversations?readerId=" + reader._id)
                      }
                    >
                      Chat History
                    </button>
                  </td>
                  <td>
                    {new Date(reader.createdAt as string).toLocaleDateString(
                      "en-US"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}
