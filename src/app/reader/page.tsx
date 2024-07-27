"use client";
import { useState } from "react";

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]); // [{message: 'hello', sender: 'me'}, {message: 'hello', sender: 'me'}, {message: 'hello', sender: 'me'}
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);

  const handleNewMessage = async (e) => {
    e.preventDefault();
    // if (newMessage === "") return;
    // console.log(newMessage);
    // const updatedMessages = [
    //   ...messages,
    //   { role: "user", content: newMessage },
    // ];
    // let postBody = { message: newMessage };
    // if (chatId) postBody.chatId = chatId;
    // postBody = JSON.stringify(postBody);

    // setMessages(updatedMessages);
    // setNewMessage("");
    // setLoading(true);
    // console.log(postBody);
    // const chatResponse = await fetch(apiURL + "/chat", {
    //   method: "POST",
    //   body: postBody,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // let chatCompletedMessages = await chatResponse.json();
    // if (!chatId) setChatId(chatCompletedMessages._id);
    // chatCompletedMessages = chatCompletedMessages.history;
    // console.log(chatCompletedMessages);
    // setLoading(false);
    // setMessages(chatCompletedMessages);
    // if (loading) return;
  };

  return (
    <div className="w-[800px] pt-3 m-auto flex flex-col h-screen">
      {/* Moral Code Header w Link */}
      <div className="flex items-center justify-center">
        <div className="font-bold">
          Chat with Character from the Book! &nbsp;
        </div>
        <div>
          More info here:{" "}
          <a href="https://www.website.com" className="text-blue-500 underline">
            LinkToTheBook.com
          </a>
        </div>
      </div>

      {/*Chat Messages*/}
      <div className="mt-3 pb-[90px]">
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
                message.role == "user" ? "chat chat-end" : "chat chat-start"
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
            onChange={(event) => setNewMessage(event.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
