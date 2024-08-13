"use client";
import PlusIcon from "@/components/icons/PlusIcon";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useState, useEffect } from "react";
import { IBook } from "@/lib/models/Book";
import { Fetch } from "@/lib/util/Fetch";

export default function AuthorBooksDashboard() {
  const [books, setBooks] = useState<IBook[]>([] as IBook[]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBooks = async () => {
    setIsLoading(true);
    const response = await Fetch("/api/author/books/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }

    const data = await response.json();
    console.log(data);
    setBooks(data.books);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <h1 className="text-left">Books Dashboard</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="flex flex-wrap">
          {books.map((book, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]"
              onClick={() =>
                (window.location.href =
                  "/author/books/single?bookId=" + book._id)
              }
            >
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
              <img
                src={book.thumbnailFileLink}
                alt="Book Image"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-gray-600">{book.summary}</p>
            </div>
          ))}
          {/* ADD BOOK BUTTON */}
          <div
            className="flex flex-col justify-center items-center rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]"
            onClick={() => (window.location.href = "/author/books/add")}
          >
            <PlusIcon size="64" />
            <p className="font-bold text-[25px] mt-[10px]">Add new book</p>
          </div>
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}
