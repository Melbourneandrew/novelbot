import { Reader, IReader } from "@/lib/models/Reader";
import { AccessCode, IAccessCode } from "@/lib/models/AccessCode";
import {
  ReaderEnteredCode,
  IReaderEnteredCode,
} from "@/lib/models/ReaderEnteredCode";
import { ICharacter } from "@/lib/models/Character";
import * as AccessCodeService from "@/lib/services/AccessCodeService";

export async function findReaderById(id: string): Promise<IReader | null> {
  return await Reader.findById(id);
}

export async function findReaderByUserId(
  userId: string
): Promise<IReader | null> {
  return await Reader.findOne({ user: userId });
}

export async function findReadersByAuthor(
  authorId: string
): Promise<IReader[]> {
  const accessCodes = await AccessCode.find({ author: authorId });

  const readerEnteredCodes = await ReaderEnteredCode.find({
    accessCode: { $in: accessCodes.map((accessCode) => accessCode._id) },
  });

  const readers = await Reader.find({
    id: {
      $in: readerEnteredCodes.map(
        (readerEnteredCode) => readerEnteredCode.reader._id
      ),
    },
  });
  return readers;
}

export async function findCharactersByReader(
  readerId: string
): Promise<ICharacter[] | []> {
  const accessCodes = await AccessCodeService.findAccessCodesByReaderId(
    readerId
  );
  console.log(accessCodes);
  const characters = accessCodes?.reduce((acc, accessCode) => {
    return acc.concat(accessCode.characters as ICharacter[]);
  }, [] as ICharacter[]);
  return characters ?? [];
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
  accessCode: string
): Promise<IReaderEnteredCode | null> {
  const accessCodeDoc = await AccessCode.findOne({ code: accessCode });
  if (!accessCodeDoc || accessCodeDoc.expiresAt < new Date()) {
    return null;
  }
  return await ReaderEnteredCode.create({
    reader: reader._id,
    accessCode: accessCodeDoc._id,
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

export async function verifyReaderBelongsToAuthor(
  readerId: string,
  authorId: string
): Promise<boolean> {
  const reader = await Reader.findById(readerId);
  if (!reader) {
    return false;
  }
  const readerEnteredCodes = await ReaderEnteredCode.find({
    reader: reader._id,
  }).lean();
  if (!readerEnteredCodes) {
    return false;
  }
  for (const readerEnteredCode of readerEnteredCodes) {
    const accessCode = await AccessCode.findById(readerEnteredCode.accessCode);
    if (!accessCode) {
      return false;
    }
    if (accessCode.author.toString() === authorId.toString()) {
      return true;
    }
  }
  return false;
}

export async function deleteReaderAndTheirEnteredCodes(readerId: string) {
  await ReaderEnteredCode.deleteMany({ reader: readerId });
  return await Reader.findByIdAndDelete(readerId);
}
