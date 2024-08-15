"use client";
import { useState } from "react";
import ButtonWithLoading from "../ButtonWithLoading";
import { getEntriesFromRequestHistory } from "@/lib/util/request-history";
import ChatBubbleIcon from "../icons/ChatBubbleIcon";
export default function BasicModal() {
  const [feedbackMessage, setFeedbackMessage] =
    useState<string>("");
  const submitFeedback = async () => {
    const requestHistory = getEntriesFromRequestHistory();
    const request = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        message: feedbackMessage,
        requestHistory,
      }),
    });

    if (!request.ok) {
      console.error("Error submitting feedback");
      return;
    }
    (
      document.getElementById(
        "feedback_modal"
      ) as HTMLDialogElement
    ).close();
    setFeedbackMessage("");
  };

  return (
    <>
      <button
        className="btn btn-primary absolute top-4 right-4"
        onClick={() => {
          const modal = document.getElementById(
            "feedback_modal"
          ) as HTMLDialogElement;
          modal?.showModal();
        }}
      >
        Feedback <ChatBubbleIcon color="white" />
      </button>
      <dialog id="feedback_modal" className="modal">
        <div className="modal-box absolute top-4 right-4">
          <h3 className="font-bold text-lg">
            Leave some feedback!
          </h3>
          <p className="py-4">
            Describe your expierence, lodge a complaint, or
            leave a suggestion. Don&apos;t hold back!
          </p>
          <textarea
            className="textarea textarea-bordered w-[100%] h-[150px] resize-none"
            placeholder="Describe your issue or suggestion"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
          ></textarea>
          <div className="modal-action">
            <ButtonWithLoading
              className="btn btn-primary"
              action={submitFeedback}
            >
              Submit
            </ButtonWithLoading>
          </div>
        </div>
        {/* Second form to close the modal when clicking outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
