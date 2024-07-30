export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateReaderAccessCode(): string {
  return generateRandomString(8);
}

export function generateBookContentFileName(): string {
  return "book_content_" + generateRandomString(16);
}

export function generateBookThumbnailFileName(): string {
  return "book_thumbnail_" + generateRandomString(16);
}

export function generateCharacterThumbnailFileName(): string {
  return "character_thumbnail_" + generateRandomString(16);
}
export function generateRandomWords(wordCount: number): string {
  const randomWords = [];
  for (let j = 0; j < wordCount; j++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push(words[randomIndex]);
  }
  return randomWords.join(" ");
}

var words = [
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
