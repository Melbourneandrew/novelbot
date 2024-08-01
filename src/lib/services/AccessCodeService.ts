import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from "react";
import { AccessCode, IAccessCode } from "../models/AccessCode";
import { ReaderEnteredCode } from "../models/ReaderEnteredCode";

export async function findAccessCodeById(
  id: string
): Promise<IAccessCode | null> {
  //TODO: Implement caching
  return await AccessCode.findById(id);
}

export async function createAccessCode(
  accessCode: IAccessCode
): Promise<IAccessCode> {
  const newAccessCode = await AccessCode.create(accessCode);
  return newAccessCode;
}

export async function findAccessCodeByCode(
  code: string
): Promise<IAccessCode | null> {
  return await AccessCode.findOne({ code });
}

export async function findAccessCodesByAuthor(
  authorId: string
): Promise<IAccessCode[] | null> {
  return await AccessCode.find({ author: authorId }).populate(
    "characters"
  );
}

export async function findAccessCodesByCharacter(
  characterId: string
): Promise<IAccessCode[] | null> {
  return await AccessCode.find({ characters: characterId });
}

export async function findAccessCodesByReaderId(
  readerId: string
): Promise<IAccessCode[] | null> {
  const readerEnteredCodes = await ReaderEnteredCode.find({
    reader: readerId,
  })
    .populate({
      path: "accessCode",
      populate: {
        path: "characters",
      },
    })
    .lean();
  if (!readerEnteredCodes) {
    return null;
  }
  const accessCodes = [];
  for (const readerEnteredCode of readerEnteredCodes) {
    accessCodes.push(readerEnteredCode.accessCode);
  }
  return accessCodes;
}
