import { Character, ICharacter } from "@/lib/models/Character";
import { Dialogue, IDialogue } from "@/lib/models/Dialogue";
import * as AuthorService from "@/lib/services/AuthorService";
import { generateRandomWords } from "../util/random";
export async function findCharacterById(
  id: string
): Promise<ICharacter | null> {
  return await Character.findById(id);
}

export async function findCharactersByAuthor(
  authorId: string
): Promise<ICharacter[]> {
  return await Character.find({ author: authorId });
}

export async function findDialogueByCharacter(
  characterId: string
): Promise<IDialogue[]> {
  return await Dialogue.find({ character: characterId });
}

export async function findCharactersByBook(
  bookId: string
): Promise<ICharacter[]> {
  return await Character.find({ book: bookId });
}

export async function updateCharacter(
  characterId: string,
  characterDescription: string,
  characterBackstory: string
): Promise<ICharacter | null> {
  let updatePayload: any = {};
  if (characterDescription) updatePayload.description = characterDescription;
  if (characterBackstory) updatePayload.backstory = characterBackstory;

  return await Character.findByIdAndUpdate(characterId, updatePayload, {
    new: true,
  });
}

export async function verifyCharacterBelongsToAuthor(
  characterId: string,
  authorId: string
): Promise<boolean> {
  const character = await Character.findById(characterId).populate("book");
  if (!character) {
    return false;
  }
  const author = await AuthorService.findAuthorById(character.book.author);
  if (!author) {
    return false;
  }

  return author._id.toString() === authorId.toString();
}

export function deleteDialogue(characterId: string) {
  return Dialogue.deleteMany({ character: characterId });
}
export async function deleteCharacterAndTheirDialogue(characterId: string) {
  await Dialogue.deleteMany({ character: characterId });
  return await Character.findByIdAndDelete(characterId);
}
export async function generateRandomCharacters(bookId: string) {
  console.log("Generating random characters");
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
    "Kevin",
    "Linda",
    "Mallory",
    "Nancy",
    "Oscar",
    "Peggy",
    "Quentin",
    "Romeo",
    "Sybil",
    "Trent",
    "Ursula",
    "Victor",
    "Walter",
    "Xavier",
    "Yvonne",
    "Zelda",
  ];
  const characters = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * names.length);
    const name = names[randomIndex];
    const character = new Character({
      name: name,
      book: bookId,
    });
    characters.push(character._id);
    await character.save();
  }
  return characters;
}
export async function generateRandomDialogue(
  bookId: string,
  characterId: string
) {
  console.log("Generating random dialogue");

  const dialogueLines = [];
  for (let i = 0; i < 5; i++) {
    const dialogueLine = generateRandomWords(15);
    const dialogue = new Dialogue({
      character: characterId,
      text: dialogueLine,
      book: bookId,
    });
    await dialogue.save();
    dialogueLines.push(dialogueLine);
  }
  return dialogueLines;
}
export async function generateRandomDescription(characterId: string) {
  console.log("Generating random description");
  const randomDescription = generateRandomWords(40);
  await Character.findByIdAndUpdate(
    characterId,
    { description: randomDescription },
    { new: true }
  );
}

export async function generateRandomBackstory(characterId: string) {
  console.log("Generating random backstory");
  const randomBackstory = generateRandomWords(40);
  await Character.findByIdAndUpdate(
    characterId,
    { backstory: randomBackstory },
    { new: true }
  );
}
