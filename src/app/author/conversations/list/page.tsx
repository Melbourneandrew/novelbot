"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useSearchParams } from "next/navigation";
import { IConversation } from "@/lib/models/Conversation";
import { ICharacter } from "@/lib/models/Character";
import { IReader } from "@/lib/models/Reader";
import DropdownIcon from "@/components/icons/DropdownIcon";
import ErrorMessage from "@/components/ErrorMessage";
import { Fetch } from "@/lib/util/Fetch";

export default function ConversationsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversations, setConversations] = useState<IConversation[]>(
    [] as IConversation[]
  );
  const [characterOptions, setCharacterOptions] = useState<ICharacter[]>(
    [] as ICharacter[]
  );
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const characterId = searchParams.get("characterId");
  const readerId = searchParams.get("readerId");
  const authorId = searchParams.get("authorId");

  const fetchConversations = async () => {
    setIsLoading(true);
    const response = await Fetch("/api/author/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        characterId,
        readerId,
        authorId,
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
    setConversations(data.conversations);
    setIsLoading(false);
  };

  const fetchCharacters = async () => {
    const response = await Fetch("/api/author/characters/list", {
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
    setCharacterOptions(data.characters);
  };

  useEffect(() => {
    fetchConversations();
    fetchCharacters();
  }, []);

  return (
    <div>
      <h1 className="text-4xl mb-[20px] text-left">Conversations</h1>

      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/* FILTERS */}
          <div className="flex flex-row gap-2">
            {/* Character Filter */}
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn m-1">
                Characters <DropdownIcon />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                {characterOptions.map((character, index) => (
                  <li key={index}>
                    <a href={"?characterId=" + character._id}>
                      {character.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* CONVERSATION TABLE */}
          <div className="max-w-[1000px]">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Character</th>
                  <th>Reader</th>
                  <th className="text-center">Conversation Length</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conversation, index) => (
                  <tr
                    key={index}
                    className="hover cursor-pointer"
                    onClick={() => {
                      window.location.href =
                        "/author/conversations/single?conversationId=" +
                        conversation._id;
                    }}
                  >
                    <th>{index + 1}</th>
                    <td>
                      {(conversation.character as ICharacter)?.name ??
                        "[deleted]"}
                    </td>
                    <td>{(conversation.reader as IReader).displayName}</td>
                    <td className="text-center">
                      {conversation.messages.length}
                    </td>
                    <td>
                      {new Date(
                        conversation.createdAt as string
                      ).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}
