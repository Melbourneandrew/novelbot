"use client";
import { useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
import ErrorMessage from "../ErrorMessage";
interface RemoveModalProps {
  headerText: string;
  removeRoute: string;
  documentId: string;
  removeAction?: Function;
}
export default function RemoveModal({
  headerText,
  removeRoute,
  documentId,
  removeAction,
}: RemoveModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitRemove = async () => {
    if (removeAction) {
      setIsLoading(true);
      await removeAction(documentId, setErrorMessage);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const response = await fetch(removeRoute + documentId);

    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }
    const data = await response.json();
    console.log(data);
    setIsLoading(false);

    const modal = document.getElementById("remove_modal") as HTMLDialogElement;
    modal?.close();
    window.history.back();
  };
  return (
    <dialog id="remove_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{headerText}</h3>
        <p className="py-4 text-center">
          This operation is PERMANENT and cannot be undone. Are you sure you
          want to proceed?
        </p>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <div className="modal-action justify-center">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <button
              className="btn btn-error"
              onClick={() => {
                submitRemove();
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {/* Second form to close the modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
