"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ICharacter } from "@/lib/models/Character";
import BackArrowIcon from "@/components/icons/BackArrowIcon";
import { IReader } from "@/lib/models/Reader";
import { IAccessCode } from "@/lib/models/AccessCode";
import RemoveModal from "@/components/modals/RemoveModal";

export default function AuthorReaderSingleView() {
  const searchParams = useSearchParams();
  const readerId = searchParams.get("readerId");
  const [reader, setReader] = useState<IReader>({} as IReader);
  const [readerAccessCodes, setReaderAccessCodes] = useState<IAccessCode[]>(
    [] as IAccessCode[]
  );
  const [conversationCount, setConversationCount] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReader = async () => {
    setIsLoading(true);
    const response = await fetch(
      "/api/author/readers/single?readerId=" + readerId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data);
    setReader(data.reader);
    setReaderAccessCodes(data.accessCodes);
    setConversationCount(data.conversationCount ?? 0);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReader();
  }, []);

  return (
    <>
      <div className="flex gap-2 mb-[10px]">
        <button onClick={() => window.history.back()}>
          <BackArrowIcon size="25" />
        </button>
        <h1 className="text-left">Reader overview for: {reader.displayName}</h1>
      </div>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/* Reader Info */}
          <div className="mb-[20px]">
            <div>Reader Display Name: {reader.displayName as string}</div>
            <div>Reader Id: {reader._id as string}</div>
            <div>Created at: {reader.createdAt}</div>
            <div>Conversations had: {conversationCount}</div>
          </div>
          {/* Action Menu */}
          <div className="flex gap-1">
            <button
              className="btn btn-primary"
              onClick={() =>
                (window.location.href =
                  "/author/conversations?readerId=" + readerId)
              }
            >
              Conversation History
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                const modal = document.getElementById(
                  "remove_modal"
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Remove Reader
            </button>
          </div>
          <h1 className="text-left mt-[30px]">Access Codes</h1>
          {/* Access Codes */}
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Characters</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {readerAccessCodes.map((code, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{code.name}</td>
                    <td>{code.code}</td>
                    <td>
                      {code.characters
                        .map((character) =>
                          (character as ICharacter).name?.length > 10
                            ? (character as ICharacter).name.substring(0, 10) +
                              "..."
                            : (character as ICharacter).name
                        )
                        .join(", ")}
                    </td>
                    <td>
                      {new Date(code.expires).getFullYear() >
                      new Date().getFullYear() + 90
                        ? "Never"
                        : new Date(code.expires).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <RemoveModal
        headerText={"Remove Reader: " + reader.displayName}
        removeRoute={"/api/author/readers/remove?readerId="}
        documentId={readerId as string}
      />
    </>
  );
}
