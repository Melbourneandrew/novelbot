"use client";
import { IDialogue } from "@/lib/models/Dialogue";
import { useState } from "react";
import PenIcon from "@/components/icons/PenIcon";
import StarIcon from "@/components/icons/StarIcon";
import TrashCanIcon from "@/components/icons/TrashCanIcon";
import CheckIcon from "../icons/CheckIcon";
import XIcon from "../icons/XIcon";
import SearchIcon from "../icons/SearchIcon";

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
                          value={dialogue.text}
                          onChange={(e) =>
                            setUpdatedDialogueLine(e.target.value)
                          }
                        />
                        <button className="btn btn-outline">
                          <CheckIcon />
                        </button>
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
                      <button className="btn btn-outline">
                        <TrashCanIcon />
                      </button>
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
