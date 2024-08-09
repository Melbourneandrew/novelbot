"use client";
import { useState, useEffect } from "react";
import DropdownIcon from "@/components/icons/DropdownIcon";
import { ICharacter } from "@/lib/models/Character";
import XIcon from "../icons/XIcon";
import { generateReaderAccessCode } from "@/lib/util/random";
import ButtonWithLoading from "../ButtonWithLoading";

interface AccessCodeModalProps {
  preSelectedCharacter?: ICharacter;
}
export default function CreateAccessCodeModal({
  preSelectedCharacter,
}: AccessCodeModalProps) {
  /**
   * Enable this modal with
   * <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
   */
  const [errorMessage, setErrorMessage] = useState("");

  const [codeName, setCodeName] = useState("");
  const [codeValue, setCodeValue] = useState(generateReaderAccessCode());
  const [expirationDate, setExpirationDate] = useState("");
  const [neverExpires, setNeverExpires] = useState(false);

  const [characterOptions, setCharacterOptions] = useState<ICharacter[]>(
    [] as ICharacter[]
  );
  const [selectedCharacterOptions, setSelectedCharacterOptions] = useState<
    ICharacter[]
  >([] as ICharacter[]);

  const submitCode = async () => {
    console.log(
      codeName,
      codeValue,
      selectedCharacterOptions,
      expirationDate,
      neverExpires
    );

    if (!codeName) {
      setErrorMessage("Code name is required");
      return;
    }
    if (!codeValue) {
      setErrorMessage("Code value is required");
      return;
    }
    if (!expirationDate) {
      setErrorMessage("Expiration date is required");
      return;
    }
    if (selectedCharacterOptions.length === 0) {
      setErrorMessage("At least one character is required");
      return;
    }
    if (selectedCharacterOptions.some((character) => !character)) {
      setErrorMessage("At least one character is required");
      return;
    }

    const createCodeResponse = await fetch(
      "/api/author/readers/access-codes/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeName,
          codeValue,
          selectedCharacterOptions,
          expirationDate,
          neverExpires,
        }),
      }
    );
    if (!createCodeResponse.ok) {
      const error = await createCodeResponse.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }
    const data = await createCodeResponse.json();
    console.log(data);

    const modal = document.getElementById(
      "new_access_code_modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const fetchCharacters = async () => {
    const response = await fetch("/api/author/characters/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }

    const data = await response.json();
    console.log(data);
    setCharacterOptions(data.characters);
  };

  const selectCharacter = async (character: ICharacter) => {
    console.log(selectedCharacterOptions);
    const newSelectedCharacters = [...selectedCharacterOptions];

    if (
      newSelectedCharacters.some(
        (selectedCharacter) => selectedCharacter._id === character._id
      )
    ) {
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(character), 1);
    } else {
      newSelectedCharacters.push(character);
    }
    setSelectedCharacterOptions(newSelectedCharacters);
  };

  useEffect(() => {
    fetchCharacters();
    setExpirationDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    );
    if (preSelectedCharacter) {
      setSelectedCharacterOptions([preSelectedCharacter as ICharacter]);
    }
  }, [preSelectedCharacter]);

  return (
    <dialog id="new_access_code_modal" className="modal">
      <div className="modal-box">
        <div className="text-[20px] font-bold text-lg">
          Create a New Reader Access Code
        </div>
        <p className="py-4">
          Access codes are used to allow readers to access your publication. You
          can create a new access code here.
        </p>
        <div className="flex flex-col gap-4">
          {/* CODE NAME */}
          <div>
            <div className="text-[18px] font-bold">Code Name</div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
            />
          </div>
          {/* CODE VALUE */}
          <div>
            <div className="text-[18px] font-bold">
              Code Value (add a custom one if you&apos;d like)
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
            />
          </div>
          {/* CHARACTER SELECT */}
          <div>
            <div className="text-[18px] font-bold">Character(s)</div>
            <details className="dropdown">
              <summary className="btn m-1">
                Select Characters <DropdownIcon />
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {characterOptions.map((character, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedCharacterOptions.some(
                          (selectedCharacter) =>
                            selectedCharacter._id === character._id
                        )}
                        onChange={() => {
                          selectCharacter(character);
                        }}
                      />
                      {character.name}
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          {/* CHARACTER DISPLAY */}
          <div>
            <div className="flex gap-1">
              {selectedCharacterOptions.map((character, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-1 w-fit"
                >
                  <div className="text-[15px] font-bold">
                    {character.name +
                      (!character.published ? " (Unpublished)" : "")}
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      const newSelectedCharacters = [
                        ...selectedCharacterOptions,
                      ];
                      newSelectedCharacters.splice(
                        newSelectedCharacters.indexOf(character),
                        1
                      );
                      setSelectedCharacterOptions(newSelectedCharacters);
                    }}
                  >
                    <XIcon size="16" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* EXPIRATION DATE */}
          <div>
            <div className="text-[18px] font-bold">Expiration Date</div>
            <p>(Defaults to 30 days out)</p>
            <input
              type="date"
              id="expires"
              name="expires"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          {/* NEVER EXPIRES CHECKBOX */}
          <div className="flex">
            <div className="text-[17px] mr-[30px]">Never expires</div>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              defaultChecked={neverExpires}
              onChange={(e) => setNeverExpires(e.target.checked)}
            />
          </div>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-center mt-[15px]">{errorMessage}</p>
        )}
        <div className="modal-action">
          <ButtonWithLoading className="btn btn-primary" action={submitCode}>
            Create
          </ButtonWithLoading>
        </div>
      </div>
      {/* Second form to close the modal when clicking outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
