/**
 * Strict server-side image file validation using actual binary magic bytes.
 * Prevents fake extensions, MIME spoofing, SVG/HTML XSS uploads, and executables.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

const FORBIDDEN_EXTENSIONS = new Set([
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".js",
  ".mjs",
  ".cjs",
  ".php",
  ".py",
  ".html",
  ".htm",
  ".svg",
  ".xml",
]);

/**
 * Inspects the binary header of a Buffer and returns the verified image format,
 * or null if the bytes do not match an allowed raster image signature.
 */
export function detectImageSignature(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return null;
  }

  // Reject executable & script headers explicitly (PE 'MZ', ELF, shebang, HTML/XML)
  if (
    (buffer[0] === 0x4d && buffer[1] === 0x5a) || // MZ (Windows PE)
    (buffer[0] === 0x7f &&
      buffer[1] === 0x45 &&
      buffer[2] === 0x4c &&
      buffer[3] === 0x46) || // ELF
    (buffer[0] === 0x23 && buffer[1] === 0x21) || // #! script
    buffer[0] === 0x3c // '<' (HTML/SVG/XML/PHP)
  ) {
    return null;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  // AVIF: ....ftypavif or ....ftypavis
  const ftyp = buffer.subarray(4, 12).toString("ascii");
  if (ftyp === "ftypavif" || ftyp === "ftypavis" || ftyp === "ftypmif1") {
    return "image/avif";
  }

  return null;
}

export function validateUploadedImage({ buffer, filename = "", mimeType = "" }) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    return { valid: false, error: "Empty or invalid file upload." };
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: "File exceeds the 10 MB maximum image size limit.",
    };
  }

  const lowerName = String(filename || "").toLowerCase().trim();
  const dotIndex = lowerName.lastIndexOf(".");
  const ext = dotIndex >= 0 ? lowerName.slice(dotIndex) : "";

  if (FORBIDDEN_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: "Executable or script files are strictly prohibited.",
    };
  }

  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: "Unsupported file extension. Allowed: JPG, PNG, WebP, AVIF.",
    };
  }

  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: "Unsupported MIME type. Allowed: JPEG, PNG, WebP, AVIF.",
    };
  }

  const detectedMime = detectImageSignature(buffer);
  if (!detectedMime) {
    return {
      valid: false,
      error:
        "File content failed binary signature verification. Only genuine JPEG, PNG, WebP, or AVIF images are accepted.",
    };
  }

  return { valid: true, detectedMime };
}
