"use client";
import { useState } from "react";
import BackArrowIcon from "@/components/icons/BackArrowIcon";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function CreateBook() {
  const [bookTitle, setBookTitle] = useState("");
  const [bookSummary, setBookSummary] = useState("");
  const [contentFileLink, setContentFileLink] = useState("placeholder");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitAddBook = async () => {
    setIsLoading(true);
    const submitAddBookResponse = await fetch("/api/author/books/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookTitle,
        bookSummary,
        contentFileLink,
      }),
    });
    setIsLoading(false);

    if (submitAddBookResponse.ok) {
      console.log("Book Added");
      window.location.href = "/author/books";
    } else {
      const error = await submitAddBookResponse.text();
      console.error(error);
      setErrorMessage(error);
    }
  };
  return (
    <>
      <div className="flex gap-2 items-center mb-[25px]">
        <div>
          <BackArrowIcon size="28" />
        </div>
        <h1 className="text-left">Add Book</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-[25px] font-bold">Book title</div>
          <input
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <div className="text-[25px] font-bold">Book summary</div>
          <input
            value={bookSummary}
            onChange={(e) => setBookSummary(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <div className="text-[25px] font-bold">Book PDF</div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <p>
            Your book PDF will be used to collect your characters dialogue to
            create a chatbot that acts and sounds like them. The PDF will not be
            stored beyond what is necessary to support the creation of your
            characters bot profile.
          </p>
        </div>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <button
            onClick={() => submitAddBook()}
            className="btn btn-primary w-fit wt-[20px]"
          >
            Add book
          </button>
        )}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </>
  );
}
