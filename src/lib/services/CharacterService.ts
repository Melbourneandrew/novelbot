import { Character, ICharacter } from "@/lib/models/Character";
import { Dialogue, IDialogue } from "@/lib/models/Dialogue";

export async function deleteCharacterAndTheirDialogue(
  characterId: string
) {
  await Dialogue.deleteMany({ character: characterId });
  return await Character.findByIdAndDelete(characterId);
}
export async function generateRandomCharacters(bookId: string) {
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
    const randomIndex = Math.floor(
      Math.random() * names.length
    );
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
  const words = [
    "adventure",
    "brave",
    "curious",
    "danger",
    "eager",
    "fearless",
    "gallant",
    "heroic",
    "imagine",
    "journey",
    "kind",
    "legend",
    "mystery",
    "noble",
    "optimistic",
    "puzzle",
    "quest",
    "rescue",
    "secret",
    "treasure",
    "unite",
    "victory",
    "wonder",
    "xenial",
    "youthful",
    "zealous",
    "ancient",
    "battle",
    "courage",
    "discover",
    "enigma",
    "fortune",
    "glory",
    "honor",
    "inspire",
    "justice",
    "kingdom",
    "loyal",
    "magic",
    "narrative",
    "oath",
    "prophecy",
    "realm",
    "saga",
    "tale",
    "unravel",
    "valor",
    "whisper",
    "xenon",
    "yearn",
    "zenith",
    "artifact",
    "beacon",
    "champion",
    "destiny",
    "epic",
    "fable",
    "guardian",
    "haven",
    "illusion",
    "jewel",
    "knight",
    "lore",
    "myth",
    "nurture",
    "oracle",
    "pioneer",
    "relic",
    "sorcery",
    "triumph",
    "unveil",
    "venture",
    "wisdom",
    "xylophone",
    "yonder",
    "zephyr",
    "armor",
    "bounty",
    "conquer",
    "dragon",
    "empire",
    "fate",
    "giant",
    "horizon",
    "invincible",
    "jungle",
    "keystone",
    "labyrinth",
    "mystic",
    "nebula",
    "omen",
  ];

  const dialogueLines = [];
  for (let i = 0; i < 5; i++) {
    const randomWords = [];
    for (let j = 0; j < 15; j++) {
      const randomIndex = Math.floor(
        Math.random() * words.length
      );
      randomWords.push(words[randomIndex]);
    }
    const dialogueLine = randomWords.join(" ");
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
