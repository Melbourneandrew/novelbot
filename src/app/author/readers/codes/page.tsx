"use client";
import { useState, useEffect } from "react";
import PlusIcon from "@/components/icons/PlusIcon";
import CreateAccessCodeModal from "@/components/modals/CreateAccessCodeModal";
import { IAccessCode } from "@/lib/models/AccessCode";
import LoadingIndicator from "@/components/LoadingIndicator";
import { ICharacter } from "@/lib/models/Character";

export default function AuthorReadersAccessCodesView() {
  const [accessCodes, setAccessCodes] = useState<IAccessCode[]>(
    [] as IAccessCode[]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAccessCodes = async () => {
    setIsLoading(true);
    const response = await fetch(
      "/api/author/readers/access-codes/list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      setErrorMessage(error);
      return;
    }

    const data = await response.json();
    console.log(data);
    setAccessCodes(data.accessCodes);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAccessCodes();
  }, []);

  return (
    <div>
      <h1 className="text-left">Access Codes</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Code</th>
                <th>Characters</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {accessCodes.map((code, index) => (
                <tr className="hover" key={index}>
                  <th>{index + 1}</th>
                  <td>{code.name}</td>
                  <td>{code.code}</td>
                  <td>
                    {code.characters
                      .map((character) =>
                        (character as ICharacter).name?.length >
                        10
                          ? (
                              character as ICharacter
                            ).name.substring(0, 10) + "..."
                          : (character as ICharacter).name
                      )
                      .join(", ")}
                  </td>
                  <td>
                    {new Date(code.expires).getFullYear() >
                    new Date().getFullYear() + 90
                      ? "Never"
                      : new Date(
                          code.expires
                        ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-outline"
            onClick={() => {
              const modal = document.getElementById(
                "new_access_code_modal"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
          >
            Add Code <PlusIcon />
          </button>
        </div>
      )}

      <CreateAccessCodeModal />
    </div>
  );
}
