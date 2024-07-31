import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";

const CLOUDFLARE_R2_ACCOUNT_ID =
  process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const CLOUDFLARE_R2_ACCESS_KEY_ID =
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET_NAME =
  process.env.CLOUDFLARE_R2_BUCKET_NAME;
const CLOUDFLARE_R2_PUBLIC_URL =
  process.env.CLOUDFLARE_R2_PUBLIC_URL;
if (
  !CLOUDFLARE_R2_ACCOUNT_ID ||
  !CLOUDFLARE_R2_ACCESS_KEY_ID ||
  !CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  !CLOUDFLARE_R2_BUCKET_NAME ||
  !CLOUDFLARE_R2_PUBLIC_URL
)
  throw new Error(
    "CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET_NAME, CLOUDFLARE_R2_PUBLIC_URL must be set"
  );

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadImageToR2(
  imageFileName: string,
  imageFile: File
): Promise<boolean> {
  //TODO: Check that image is the correct type
  // if (!imageFile.type.startsWith("image/")) {
  //   throw new Error("Invalid image type");
  // }

  const imageFileBuffer = Buffer.from(
    await imageFile.arrayBuffer()
  );

  const uploaded = await r2.send(
    new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: imageFileName,
      Body: imageFileBuffer,
      ContentType: imageFile.type,
    })
  );

  return uploaded ? true : false;
}

export function makeR2PublicUrl(fileName: string) {
  return `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;
}
