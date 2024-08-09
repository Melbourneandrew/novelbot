"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { IBook } from "@/lib/models/Book";
import { ICharacter } from "@/lib/models/Character";
import BackArrowIcon from "@/components/icons/BackArrowIcon";
import UploadThumbnailModal from "@/components/modals/UploadThumbnailModal";
import RemoveModal from "@/components/modals/RemoveModal";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import ErrorMessage from "@/components/ErrorMessage";
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
        src={book.thumbnailFileLink}
        alt="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL3JtNTM1LWJvb2stMDJhXzEucG5n.png"
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
            <ButtonWithLoading
              className="btn btn-primary"
              action={() => console.log("Not implemented")}
            >
              Re-Process
            </ButtonWithLoading>
            <ButtonWithLoading
              className="btn btn-primary"
              action={() => {
                const modal = document.getElementById(
                  "change_thumbnail_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Change Thumbnail
            </ButtonWithLoading>
            <ButtonWithLoading
              className="btn btn-primary"
              action={() =>
                (window.location.href =
                  "/author/conversations?bookId=" + bookId)
              }
            >
              Conversation History
            </ButtonWithLoading>
            <ButtonWithLoading
              className="btn btn-error"
              action={() => {
                const modal = document.getElementById(
                  "remove_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Remove Book
            </ButtonWithLoading>
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
                    src={character.thumbnailFileLink}
                    alt="https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg"
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <p className="text-gray-600">{character.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <UploadThumbnailModal
        headerText={"Upload a new thumbnail image for this book."}
        uploadRoute={"/api/author/books/thumbnail"}
        documentId={bookId as string}
      />
      <RemoveModal
        headerText={"Remove Book: " + book.title}
        removeRoute={"/api/author/books/remove?bookId="}
        documentId={bookId as string}
      />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </>
  );
}
