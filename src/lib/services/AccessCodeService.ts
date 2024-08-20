import { AccessCode, IAccessCode } from "../models/AccessCode";
import { ReaderEnteredCode } from "../models/ReaderEnteredCode";
import { ICharacter, Character } from "../models/Character";

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

export interface DisplayAccessCode extends IAccessCode {
  accessRevoked: boolean;
}
export async function findAccessCodesByReaderId(
  readerId: string
): Promise<DisplayAccessCode[] | null> {
  //register character model
  Character.init();
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
    const code =
      readerEnteredCode.accessCode as DisplayAccessCode;
    code.accessRevoked = readerEnteredCode.accessRevoked;
    accessCodes.push(readerEnteredCode.accessCode);
  }
  return accessCodes;
}

export async function removeAccessCode(
  accessCodeId: string
): Promise<boolean> {
  const accessCode = await AccessCode.findByIdAndDelete(
    accessCodeId
  );
  if (!accessCode) {
    return false;
  }
  return true;
}
