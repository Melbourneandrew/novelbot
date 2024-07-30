import { S3Client } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";

const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
if (
  !CLOUDFLARE_R2_ACCOUNT_ID ||
  !CLOUDFLARE_R2_ACCESS_KEY_ID ||
  !CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  !CLOUDFLARE_R2_BUCKET_NAME
)
  throw new Error(
    "CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET_NAME must be set"
  );

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

// export async function uploadImageToBucket(file: File, filename: string) {
//   let res;

//   try {
//     const parallelUploads = new Upload({
//       client: r2,
//       params: {
//         CLOUDFLARE_R2_BUCKET_NAME,
//         filename,
//         Body: file.stream(),
//         ACL: "public-read",
//         ContentType: file.type,
//       },
//       queueSize: 4,
//       leavePartsOnError: false,
//     });

//     res = await parallelUploads.done();
//   } catch (e) {
//     throw e;
//   }

//   return res;
// }
