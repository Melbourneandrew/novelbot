"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ICharacter } from "@/lib/models/Character";
import { IDialogue } from "@/lib/models/Dialogue";
import BackArrowIcon from "@/components/icons/BackArrowIcon";

export default function AuthorCharacterSingleView() {
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const [character, setCharacter] = useState<ICharacter>({} as ICharacter);
  const [characterDescription, setCharacterDescription] = useState<string>("");
  const [characterBackstory, setCharacterBackstory] = useState<string>("");
  const [dialogue, setDialogue] = useState<IDialogue[]>([] as IDialogue[]);
  const [conversationCount, setConversationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [
    isSaveCharacterDescriptionLoading,
    setIsSaveCharacterDescriptionLoading,
  ] = useState(false);
  const [isSaveCharacterBackstoryLoading, setIsSaveCharacterBackstoryLoading] =
    useState(false);
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
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    console.log(data);
    setCharacter(data.character);
    setCharacterDescription(data.character.description ?? "");
    setCharacterBackstory(data.character.backstory ?? "");
    setDialogue(data.dialogue);
    setConversationCount(data.conversationCount ?? 0);
    console.log(characterBackstory == (character.backstory ?? ""));
    setIsLoading(false);
  };

  const updateCharacterDescription = async () => {
    setIsSaveCharacterDescriptionLoading(true);

    const response = await fetch("/api/author/characters/single/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: characterId,
        characterDescription: characterDescription,
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
    setCharacterDescription(characterDescription);
    setIsSaveCharacterDescriptionLoading(false);
  };

  const updateCharacterBackstory = async () => {
    setIsSaveCharacterBackstoryLoading(true);
    const response = await fetch("/api/author/characters/single/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: characterId,
        characterBackstory: characterBackstory,
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
    setCharacterBackstory(characterBackstory);
    setIsSaveCharacterBackstoryLoading(false);
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
      <div className="flex gap-2 mb-[10px]">
        <button className="btn btn-outline" onClick={()=>(window.history.back())}>
          <BackArrowIcon size="20" />
        </button>
        <h1 className="text-left">Character overview for: {character.name}</h1>
      </div>
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
            <div className="relative w-fit">
              <div className="font-bold">Character Description</div>
              <textarea
                className="textarea textarea-bordered w-[1000px] h-[200px] resize-none"
                placeholder="Add some lore here or press 'Generate Bot' to get an AI suggested character description"
                value={characterDescription}
                onChange={(e) => setCharacterDescription(e.target.value)}
              ></textarea>
              {!(characterDescription == (character.description ?? "")) && (
                <button
                  className="btn btn-primary absolute bottom-[15px] right-[10px]"
                  onClick={() => updateCharacterDescription()}
                >
                  Save
                </button>
              )}
            </div>
            <div className="relative w-fit">
              <div className="font-bold">Backstory</div>
              <textarea
                className="textarea textarea-bordered w-[1000px] h-[200px] resize-none"
                placeholder="Add some lore here or press 'Generate Bot' to get an AI suggested backstory"
                value={characterBackstory}
                onChange={(e) => setCharacterBackstory(e.target.value)}
              ></textarea>
              {!(characterBackstory == (character.backstory ?? "")) &&
                (isSaveCharacterDescriptionLoading ? (
                  <LoadingIndicator />
                ) : (
                  <button
                    className="btn btn-primary absolute bottom-[15px] right-[10px]"
                    onClick={() => updateCharacterBackstory()}
                  >
                    Save
                  </button>
                ))}
            </div>
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
              Change Thumbnail
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                (window.location.href =
                  "/author/conversations?characterId=" + characterId)
              }
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
