"use client";

"use client";
import PlusIcon from "@/components/icons/PlusIcon";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useState, useEffect } from "react";
import { ICharacter } from "@/lib/models/Character";

export default function AuthorCharactersView() {
  const [characters, setCharacters] = useState<ICharacter[]>([] as ICharacter[]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCharacters = async () => {
    setIsLoading(true);
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
    setCharacters(data.characters);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <>
      <h1 className="text-left">Characters Dashboard</h1>
      <div className="flex flex-wrap">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          characters.map((character, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]"
              onClick={() =>
                (window.location.href =
                  "/author/characters/single?characterId=" + character._id)
              }
            >
              <h2 className="text-lg font-semibold mb-2">{character.name}</h2>
              <img
                src="https://www.webwise.ie/wp-content/uploads/2020/12/IMG1207.jpg"
                alt="Card Image"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-gray-600">{character.description}</p>
            </div>
          ))
        )}
        <div
          className="flex flex-col justify-center items-center rounded-lg border border-gray-300 hover:bg-gray-100 p-4 m-2 w-[450px] h-[280px]"
          onClick={() => (window.location.href = "/author/characters/add")}
        >
          <PlusIcon size="64" />
          <p className="font-bold text-[25px] mt-[10px]">Add new character</p>
        </div>
      </div>
    </>
  );
}
