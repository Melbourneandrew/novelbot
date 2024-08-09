"use client";
import { useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
import ErrorMessage from "../ErrorMessage";
interface UploadThumbnailModalProps {
  headerText: string;
  uploadRoute: string;
  documentId: string;
}
export default function UploadThumbnailModal({
  headerText,
  uploadRoute,
  documentId,
}: UploadThumbnailModalProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleThumbnailFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      console.log("Thumbnail file changed");
      const currentFile = event.target.files[0];
      setThumbnailFile(currentFile);

      const objectUrl = URL.createObjectURL(currentFile);
      setThumbnailPreview(objectUrl);
    }
  };

  const submitThumbnail = async () => {
    if (!thumbnailFile) {
      console.log("Please add a thumbnail file");
      setErrorMessage("Please add a thumbnail file");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("thumbnail", thumbnailFile);
    formData.append("documentId", documentId);

    const response = await fetch(uploadRoute, {
      method: "POST",
      body: formData,
    });

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

    const modal = document.getElementById(
      "change_thumbnail_modal"
    ) as HTMLDialogElement;
    modal?.close();
    window.location.reload();
  };
  return (
    <dialog id="change_thumbnail_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-xl mb-[20px]">{headerText}</h3>
        <img
          className="mask mask-squircle m-auto border-solid border-2 border-gray-400 ring-offset-2 mb-[20px]"
          src={thumbnailPreview}
        ></img>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".jpg, .jpeg, .png"
          onChange={handleThumbnailFileChange}
        />
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <div className="modal-action">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => submitThumbnail()}
            >
              Change Thumbnail
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
