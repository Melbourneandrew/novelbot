"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useSearchParams } from "next/navigation";
import { IConversation } from "@/lib/models/Conversation";

export default function StarterTemplateView() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversation, setConversation] =
    useState<IConversation>({} as IConversation);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const fetchConversation = async () => {
    setIsLoading(true);
    const response = await fetch(
      "/api/author/conversations/single?converstaionId=" +
        conversationId
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
        <p>This is some content</p>
      )}

      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
