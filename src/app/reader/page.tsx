"use client";
import { useState, useEffect } from "react";
import { ICharacter } from "@/lib/models/Character";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  IConversation,
  Message,
} from "@/lib/models/Conversation";

interface ChatRequestBody {
  messages: Message[];
  characterId?: string;
  conversationId?: string;
}
interface ChatResponse {
  conversation: IConversation;
}

export default function Chat() {
  const [isCharacterListLoading, setIsCharacterListLoading] =
    useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [availableCharacters, setAvailableCharacters] =
    useState<ICharacter[]>([] as ICharacter[]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<ICharacter>();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    [] as Message[]
  ); // [{message: 'hello', sender: 'me'}, {message: 'hello', sender: 'me'}, {message: 'hello', sender: 'me'}
  const [conversationId, setConversationId] = useState(null);

  const handleNewMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (newMessage === "") return;
    console.log(newMessage);
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: newMessage },
    ];
    let postBody: ChatRequestBody = {
      messages: updatedMessages,
    };
    if (conversationId) {
      postBody.conversationId = conversationId;
    } else {
      postBody.characterId = selectedCharacter?._id;
    }

    setMessages(updatedMessages);
    setNewMessage("");
    setIsChatLoading(true);
    console.log(postBody);
    let chatResponse = await fetch("/api/reader/chat", {
      method: "POST",
      body: JSON.stringify(postBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!chatResponse.ok) {
      const err = await chatResponse.text();
      console.log(err);
      setErrorMessage(err);
      setIsChatLoading(false);
      return;
    }

    let { conversation }: ChatResponse =
      await chatResponse.json();
    if (!conversationId) setConversationId(conversation._id);
    console.log(conversation);
    setIsChatLoading(false);
    setMessages(conversation.messages);
  };

  const getAvailableCharacters = async () => {
    setIsCharacterListLoading(true);
    const characterResponse = await fetch(
      "/api/reader/characters",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!characterResponse.ok) {
      const err = await characterResponse.text();
      console.log(err);
      setErrorMessage(err);
      setIsCharacterListLoading(false);
      return;
    }
    const { characters } = await characterResponse.json();
    setAvailableCharacters(characters);
    setIsCharacterListLoading(false);
    if (!selectedCharacter) {
      setSelectedCharacter(characters[0]);
    }
    console.log(characters);
  };

  const selectCharacter = async (character: ICharacter) => {
    setSelectedCharacter(character);
    setMessages([]);
    setChatId(null);
  };

  useEffect(() => {
    getAvailableCharacters();
  }, []);

  return (
    <div className="flex flex-row justify-center w-screen gap-[10px]">
      {/* CHARACTER AVATAR */}
      <div className="w-[400px] flex flex-col items-center">
        {isCharacterListLoading ? (
          <LoadingIndicator />
        ) : (
          <div>
            <img
              className="mask mask-squircle w-[160px] mb-auto"
              src={selectedCharacter?.thumbnailFileLink}
            />
            <h2 className="text-center">
              {selectedCharacter?.name}
            </h2>
          </div>
        )}
      </div>
      {/* CHAT */}
      <div className="w-[800px] pt-3 flex flex-col h-screen items-center">
        {/* Moral Code Header w Link */}
        <div className="flex items-center justify-center">
          <div className="font-bold">
            Chat with {selectedCharacter?.name} from the Book!
            &nbsp;
          </div>
          <div>
            More info here:{" "}
            <a
              href="https://www.website.com"
              className="text-blue-500 underline"
            >
              LinkToTheBook.com
            </a>
          </div>
        </div>
        {/*Chat Messages*/}
        <div className="mt-3 pb-[90px] w-[100%]">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src="https://m.media-amazon.com/images/I/51R7C0wiWeL.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="chat-bubble bg-[#009781] text-white">
              Hello! I am The Character.
            </div>
          </div>
          {messages.map((message, index) => {
            if (message.role == "system") return;
            return (
              <div
                className={
                  message.role == "user"
                    ? "chat chat-end"
                    : "chat chat-start"
                }
                key={index}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {message.role == "user" ? (
                      <img src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg" />
                    ) : (
                      <img
                        src="https://m.media-amazon.com/images/I/51R7C0wiWeL.jpg"
                        alt=""
                      />
                    )}
                  </div>
                </div>
                <div
                  className={
                    message.role == "user"
                      ? "chat-bubble bg-[#05b79f] text-white"
                      : "chat-bubble bg-[#009781] text-white"
                  }
                >
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>
        {/* New message input */}
        <div className="fixed bottom-5 w-[800px]">
          <form onSubmit={handleNewMessage} autoComplete="off">
            <input
              autoComplete="off"
              type="text"
              name="newMessage"
              placeholder="Send a message to The Character"
              className="input input-bordered w-full max-w"
              value={newMessage}
              onChange={(event) =>
                setNewMessage(event.target.value)
              }
            />
          </form>
        </div>
      </div>
      {/* CHARACTER SELECT */}
      <div className="w-[400px] flex flex-col items-center">
        <h1>Characters</h1>
        {isCharacterListLoading ? (
          <LoadingIndicator />
        ) : (
          availableCharacters.map((character, index) => (
            <div
              key={index}
              className="card bg-base-100 hover:bg-gray-200 hover:cursor-pointer w-96 shadow-xl mb-[5px] p-[20px]"
              onClick={() => selectCharacter(character)}
            >
              <div className="flex">
                <img
                  className="mask mask-squircle mr-[15px] w-[100px]"
                  src={character.thumbnailFileLink}
                />
                <div className="">
                  <h2 className="card-title">
                    {character.name}
                  </h2>
                  <p className="overflow-hidden text-ellipsis line-clamp-3">
                    {character.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
