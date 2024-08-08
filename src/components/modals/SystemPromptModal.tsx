"use client";

interface SystemPromptModalProps {
  systemPrompt: string;
}
export default function SystemPromptModal({
  systemPrompt,
}: SystemPromptModalProps) {
  return (
    <dialog id="system_prompt_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          System Prompt at time of character message:
        </h3>
        <p className="py-4">{systemPrompt}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
      {/* Second form to close the modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
