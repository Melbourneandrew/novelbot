import { Reader, IReader } from "@/lib/models/Reader";
import { AccessCode, IAccessCode } from "@/lib/models/AccessCode";
import {
  ReaderEnteredCode,
  IReaderEnteredCode,
} from "@/lib/models/ReaderEnteredCode";
import { ICharacter } from "@/lib/models/Character";

export async function findReaderById(id: string): Promise<IReader | null> {
  return await Reader.findById(id);
}

export async function findReaderByUserId(
  userId: string
): Promise<IReader | null> {
  return await Reader.findOne({ user: userId });
}

type CreateAuthorParams = {
  user: string;
  displayName: string;
};
export async function createReader(
  reader: CreateAuthorParams
): Promise<IReader> {
  return await Reader.create(reader);
}

/**
 * When a reader enteres an access code, a mapping between the reader and the access code is created.
 * "ReaderEnteredCode" is the junction/bridge table for this mapping
 */
export async function createReaderEnteredCode(
  reader: IReader,
  accessCode: IAccessCode
): Promise<IReaderEnteredCode> {
  return await ReaderEnteredCode.create({
    reader: reader._id,
    accessCode: accessCode._id,
  });
}

export async function findReaderEnteredCodesWithCharacters(
  readerId: string
): Promise<IReaderEnteredCode[]> {
  return await ReaderEnteredCode.find({ reader: readerId }).populate({
    path: "accessCode",
    populate: {
      path: "characters",
    },
  });
}

export async function getReaderAllowedCharacters(
  readerId: string
): Promise<ICharacter[]> {
  const enteredAccessCodes = await findReaderEnteredCodesWithCharacters(
    readerId
  );
  const allowedCharacters = [];
  for (const enteredAccessCode of enteredAccessCodes) {
    for (const character of (enteredAccessCode.accessCode as IAccessCode)
      .characters) {
      allowedCharacters.push(character as ICharacter);
    }
  }
  return allowedCharacters;
}
