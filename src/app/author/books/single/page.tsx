"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { IBook } from "@/lib/models/Book";
import { ICharacter } from "@/lib/models/Character";
import BackArrowIcon from "@/components/icons/BackArrowIcon";

export default function AuthorBookSingleView() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const [book, setBook] = useState<IBook>({} as IBook);
  const [characters, setCharacters] = useState<ICharacter[]>(
    [] as ICharacter[]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBook = async () => {
    setIsLoading(true);
    const response = await fetch("/api/author/books/single?bookId=" + bookId, {
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
    setBook(data.book);
    setCharacters(data.characters);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  return (
    <>
      <div className="flex gap-2 mb-[10px]">
        <button
          className="btn btn-outline"
          onClick={() => window.history.back()}
        >
          <BackArrowIcon size="20" />
        </button>
        <h1 className="text-left">Book overview for: {book.title}</h1>
      </div>
      <img
        src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL3JtNTM1LWJvb2stMDJhXzEucG5n.png"
        alt="Card Image"
        className="h-40 object-cover rounded-md mb-2"
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/* Book Info */}
          <div className="mb-[20px]">
            <div>Book Id: {book._id as string}</div>
            <div>Author Id: {book.author as string}</div>
            <div>Created at: {book.createdAt}</div>
            <div>Description: {book.summary ?? "No summary yet added"}</div>
          </div>
          {/* Action Menu */}
          <div className="flex gap-1">
            <button
              className="btn btn-primary"
              onClick={() => console.log("Not implemented")}
            >
              Re-Process
            </button>
            <button
              className="btn btn-primary"
              onClick={() => console.log("Not implemented")}
            >
              Change Thumbnail
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                (window.location.href =
                  "/author/conversations?bookId=" + bookId)
              }
            >
              Conversation History
            </button>
          </div>
          {/* Characters */}
          <h2 className="text-left">Characters</h2>
          <div className="flex flex-wrap">
            {characters.length === 0 ? (
              <p className="font-bold">No Characters yet!</p>
            ) : (
              characters.map((character, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]"
                  onClick={() =>
                    (window.location.href =
                      "/author/characters/single?characterId=" + character._id)
                  }
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {character.name}
                  </h2>
                  <img
                    src="https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg"
                    alt="Card Image"
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <p className="text-gray-600">{character.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}
