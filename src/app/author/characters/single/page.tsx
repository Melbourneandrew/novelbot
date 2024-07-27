"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ICharacter } from "@/lib/models/Character";
import { IDialogue } from "@/lib/models/Dialogue";

export default function AuthorCharacterSingleView() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const [character, setCharacter] = useState<ICharacter>({} as ICharacter);
  const [dialogue, setDialogue] = useState<IDialogue[]>([] as IDialogue[]);
  const [conversationCount, setConversationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCharacter = async () => {
    setIsLoading(true);
    const response = await fetch(
      "/api/author/characters/single?characterId=" + characterId,
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
      return;
    }

    const data = await response.json();
    console.log(data);
    setCharacter(data.character);
    setDialogue(data.dialogue);
    setConversationCount(data.conversationCount ?? 0);
    setIsLoading(false);
  };

  const generateBot = async () => {
    setIsLoading(true);
    const generateBotResponse = await fetch(
      "/api/author/characters/create-bot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: characterId,
        }),
      }
    );
    if (!generateBotResponse.ok) {
      const error = await generateBotResponse.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }
    const data = await generateBotResponse.json();
    console.log(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  return (
    <>
      <h1 className="text-left">Character overview for: {character.name}</h1>
      <img
        src="https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg"
        alt="Card Image"
        className="h-40 object-cover rounded-md mb-2"
      />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/* Character Info */}
          <div className="mb-[20px]">
            <div>Character Id: {character._id as string}</div>
            <div>Book Id: {character.book as string}</div>
            <div>Created at: {character.createdAt}</div>
            <div>Conversations had: {conversationCount}</div>
            <div>
              Description: {character.description ?? "No description yet added"}
            </div>
            <div>Lore: {character.lore ?? "No lore yet added"}</div>
          </div>
          {/* Action Menu */}
          <div className="flex gap-1">
            <button className="btn btn-primary" onClick={() => generateBot()}>
              Generate Bot
            </button>
            <button
              className="btn btn-primary"
              onClick={() => console.log("Not implemented")}
            >
              Chat Demo
            </button>
            <button
              className="btn btn-primary"
              onClick={() => console.log("Not implemented")}
            >
              Conversation History
            </button>
          </div>

          {/* Dialogue */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Text</th>
                  <th>Page No.</th>
                </tr>
              </thead>
              <tbody>
                {dialogue.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="font-bold">
                      No dialogue yet!
                    </td>
                  </tr>
                ) : (
                  dialogue.map((dialogue, index) => (
                    <tr key={index} className="hover">
                      <th>{index + 1}</th>
                      <td>{dialogue.text}</td>
                      <td>{dialogue.pageNumber ?? "?"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
}
