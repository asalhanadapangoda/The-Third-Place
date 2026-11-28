import { v2 as cloudinary } from "cloudinary";

export const CLOUDINARY_FOLDERS = [
  "branding",
  "coffee",
  "beverages",
  "food",
  "cafe-interior",
  "events",
  "community",
  "gallery",
];

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

/**
 * Generates server-side signed upload parameters without exposing API secrets.
 */
export function generateSignedUploadParams(folder = "gallery") {
  const safeFolder = CLOUDINARY_FOLDERS.includes(folder) ? folder : "gallery";
  const cld = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const fullFolder = `the-third-place/${safeFolder}`;

  const signature = cld.utils.api_sign_request(
    { timestamp, folder: fullFolder },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    folder: fullFolder,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}

/**
 * Server-side upload to organized `the-third-place/<folder>` directory.
 */
export async function uploadImageBuffer(buffer, folder = "gallery") {
  const safeFolder = CLOUDINARY_FOLDERS.includes(folder) ? folder : "gallery";
  const cld = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder: `the-third-place/${safeFolder}`,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteCloudinaryImage(publicId) {
  if (
    !publicId ||
    typeof publicId !== "string" ||
    !publicId.startsWith("the-third-place/") ||
    !isCloudinaryConfigured()
  ) {
    return null;
  }
  const cld = getCloudinary();
  return cld.uploader.destroy(publicId, { resource_type: "image" });
}
