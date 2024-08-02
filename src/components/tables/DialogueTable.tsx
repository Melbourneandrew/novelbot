"use client";
import { IDialogue } from "@/lib/models/Dialogue";
import { useState } from "react";
import PenIcon from "@/components/icons/PenIcon";
import StarIcon from "@/components/icons/StarIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import CheckIcon from "../icons/CheckIcon";
import XIcon from "../icons/XIcon";
import SearchIcon from "../icons/SearchIcon";
import ButtonWithLoading from "../ButtonWithLoading";

interface DialogueTableProps {
  dialogue: IDialogue[];
}
export default function DialogueTable({ dialogue }: DialogueTableProps) {
  const [selectedDialogueIndex, setSelectedDialogueIndex] = useState(-1);
  const [updatedDialogueLine, setUpdatedDialogueLine] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const selectDialogue = (index: number) => {
    setSelectedDialogueIndex(index);
  };

  const submitDialogueEdit = async () => {
    dialogue[selectedDialogueIndex].text = updatedDialogueLine;
    const response = await fetch("/api/author/dialogue/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dialogueId: dialogue[selectedDialogueIndex]._id,
        updatedText: updatedDialogueLine,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      return;
    }
    const data = await response.json();
    console.log(data);
    setSelectedDialogueIndex(-1);
  };

  const submitRemoveDialogue = async (targetIndex: number) => {
    const response = await fetch("/api/author/dialogue/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dialogueId: dialogue[targetIndex]._id,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      return;
    }

    const data = await response.json();
    console.log(data);
    dialogue.splice(targetIndex, 1);
    setSelectedDialogueIndex(-1);
  };

  return (
    <div className="overflow-x-auto">
      <label className="input input-bordered flex items-center gap-2 w-full max-w-xs">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <SearchIcon />
      </label>
      <table className="table">
        <thead>
          <tr>
            <th>Text</th>
            <th>Page No.</th>
            <th>Actions</th>
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
            dialogue
              .filter((item) =>
                item.text.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((dialogue, index) => (
                <tr key={index} className="hover">
                  <td>
                    {selectedDialogueIndex == index ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type here"
                          className="input input-bordered w-full max-w-xs"
                          defaultValue={dialogue.text}
                          value={updatedDialogueLine}
                          onChange={(e) =>
                            setUpdatedDialogueLine(e.target.value)
                          }
                        />
                        <ButtonWithLoading
                          className="btn btn-outline"
                          action={submitDialogueEdit}
                        >
                          <CheckIcon />
                        </ButtonWithLoading>
                        <button
                          className="btn btn-outline"
                          onClick={() => setSelectedDialogueIndex(-1)}
                        >
                          <XIcon />
                        </button>
                      </div>
                    ) : (
                      dialogue.text
                    )}
                  </td>
                  <td>{dialogue.pageNumber ?? "?"}</td>
                  {/* DIALOGUE ACTIONS */}
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline"
                        onClick={() => selectDialogue(index)}
                      >
                        <PenIcon />
                      </button>
                      <button className="btn btn-outline">
                        <StarIcon />
                      </button>
                      <ButtonWithLoading
                        className="btn btn-outline"
                        action={() => submitRemoveDialogue(index)}
                      >
                        <TrashCanIcon />
                      </ButtonWithLoading>
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
