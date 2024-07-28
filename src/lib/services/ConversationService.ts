import {
  Conversation,
  IConversation,
  Message,
} from "@/lib/models/Conversation";
import { Reader, IReader } from "@/lib/models/Reader";
import { Character, ICharacter } from "@/lib/models/Character";
import { Author, IAuthor } from "@/lib/models/Author";
import * as CharacterService from "@/lib/services/CharacterService";
import * as BookService from "@/lib/services/BookService";
import * as AuthorService from "@/lib/services/AuthorService";
import { IBook } from "@/lib/models/Book";
import { generateRandomWords } from "../util/random";

export type FindConversationFilters = {
  characterId?: string | null;
  bookId?: string | null;
  readerId?: string | null;
  authorId?: string | null;
};
export async function findConversations(
  filters: FindConversationFilters
): Promise<IConversation[]> {
  const { characterId, bookId, readerId, authorId } = filters;

  let queryFilters: any = {};

  if (characterId) {
    queryFilters.character = characterId;
  }
  if (bookId) {
    const characters = await CharacterService.findCharactersByBook(bookId);
    const characterIds = characters.map(
      (character: ICharacter) => character._id
    );
    queryFilters.character = { $in: characterIds };
  }
  if (readerId) {
    queryFilters.reader = readerId;
  }
  if (authorId) {
    const author = await AuthorService.findAuthorById(authorId);
    const books = await BookService.findBooksByAuthor(authorId);
    let characters: ICharacter[] = [];
    for (const book of books) {
      characters = characters.concat(
        await CharacterService.findCharactersByBook(book._id)
      );
    }
    const characterIds = characters.map(
      (character: ICharacter) => character._id
    );
    queryFilters.character = { $in: characterIds };
  }

  return await Conversation.find(queryFilters).populate([
    "character",
    "reader",
  ]);
}
export async function findConversationById(
  id: string
): Promise<IConversation | null> {
  return await Conversation.findById(id);
}

export async function findConversationsByCharacter(
  characterId: string
): Promise<IConversation[]> {
  return await Conversation.find({ character: characterId });
}

export async function findConversationsByReader(
  readerId: string
): Promise<IConversation[]> {
  return await Conversation.find({ reader: readerId });
}

export async function findConversationsByAuthor(
  authorId: string
): Promise<IConversation[]> {
  const characters = await Character.find({ author: authorId });
  const characterIds = characters.map((character: ICharacter) => character._id);
  return await Conversation.find({ character: { $in: characterIds } });
}

export async function createConversation(
  readerId: string,
  characterId: string
): Promise<IConversation> {
  return await Conversation.create({
    reader: readerId,
    character: characterId,
    messages: [],
  });
}

export async function countConversationsByCharacter(
  characterId: string
): Promise<number> {
  return await Conversation.countDocuments({ character: characterId });
}

export async function countConversationsByReader(
  readerId: string
): Promise<number> {
  return await Conversation.countDocuments({ reader: readerId });
}

export async function addMessagesToConversation(
  conversationId: string,
  messages: Message[]
): Promise<IConversation | null> {
  return await Conversation.findByIdAndUpdate(
    conversationId,
    { messages: messages },
    { new: true }
  );
}

export async function countConversationsByBook(bookId: string) {
  const characters = await Character.find({ book: bookId }).lean();
  const characterIds = characters.map(
    (character: Partial<ICharacter>) => character._id
  );
  return Conversation.countDocuments({ character: { $in: characterIds } });
}

export async function generateRandomConversation(characterId: string) {
  console.log("Generating random conversation");
  const readers: IReader[] = await Reader.find();
  if (readers.length == 0) {
    console.log("Can't generate conversation, there are no reader documents!");
  }
  const randomReader: IReader =
    readers[Math.floor(Math.random() * readers.length)];
  const messageCount = 10;
  const messages: Message[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ];
  for (let i = 0; i < messageCount; i++) {
    const randomWords = generateRandomWords(15);
    const message: Message = {
      role: i % 2 == 0 ? "user" : "assistant",
      content: randomWords,
    };
    messages.push(message);
  }
  const conversation = await createConversation(randomReader._id, characterId);
  await addMessagesToConversation(conversation._id, messages);
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
