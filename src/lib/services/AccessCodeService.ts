import { AccessCode, IAccessCode } from "../models/AccessCode";

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
  return await AccessCode.find({ author: authorId });
}

export async function findAccessCodesByCharacter(
  characterId: string
): Promise<IAccessCode[] | null> {
  return await AccessCode.find({ characters: characterId });
}
