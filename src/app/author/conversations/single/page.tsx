"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useSearchParams } from "next/navigation";
import { IConversation } from "@/lib/models/Conversation";
import { ICharacter } from "@/lib/models/Character";
import { IReader } from "@/lib/models/Reader";
export default function StarterTemplateView() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversation, setConversation] = useState<IConversation>(
    {} as IConversation
  );
  const [reader, setReader] = useState<IReader>({} as IReader);
  const [character, setCharacter] = useState<ICharacter>({} as ICharacter);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const fetchConversation = async () => {
    setIsLoading(true);
    const response = await fetch(
      "/api/author/conversations/single?conversationId=" + conversationId
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
    setConversation(data.conversation);
    setReader(data.conversation.reader);
    setCharacter(data.conversation.character);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchConversation();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          {/* CONVERSATION BETWEEN HEADER */}
          <h2 className="text-left">
            Conversation between character{" "}
            <a href={"/author/character/single?characterId=" + character._id}>
              {character.name}
            </a>{" "}
            and reader{" "}
            <a href={"/author/reader/single?readerId=" + reader._id}>
              {reader.displayName}
            </a>
          </h2>
          {/* CONVERSATION HISTORY */}
          <div>
            {conversation.messages?.map((message, index) => {
              if (index == 0) return;
              const isReader = message.role == "user";
              return (
                <div
                  className="card bg-base-100 shadow-xl mb-[10px]"
                  key={index}
                >
                  <div className="card-body flex flex-row">
                    <img
                      className="mask mask-squircle w-[50px]"
                      src={
                        isReader
                          ? "https://pub-d83e34d9fafc4ffcbe840bd347e399eb.r2.dev/default_pfp_A5921RRTGG4.jpg"
                          : character.thumbnailFileLink ?? ""
                      }
                    />
                    <div>
                      <h2 className="card-title">
                        {isReader ? reader.displayName : character.name}
                        {isReader ? (
                          <p className="text-sm text-gray-400 text-left w-fit">
                            Reader
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 text-left w-fit">
                            Character
                          </p>
                        )}
                      </h2>
                      <p>{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
