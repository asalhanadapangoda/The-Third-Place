# Cloudinary Upload & Media Security

## Protected Upload Flow
1. Only authenticated administrators with `PERMISSIONS.MANAGE_UPLOADS` can call `POST /api/upload` or `DELETE /api/upload`.
2. `verifySameOrigin()` validates the request `Origin` against `Host` to defend against CSRF.
3. Rate limiting caps uploads at 25 requests per minute per administrator.
4. `validateUploadedImage()` (`src/lib/security/fileValidation.js`) enforces:
   - **Maximum file size:** 10 MB (`10 * 1024 * 1024` bytes).
   - **Extension allowlist:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
   - **Forbidden extensions:** `.exe`, `.dll`, `.bat`, `.sh`, `.ps1`, `.js`, `.php`, `.html`, `.svg`, `.xml`, etc.
   - **Binary magic-byte verification:** Inspects raw buffer bytes (`FF D8 FF`, `89 50 4E 47`, `RIFF....WEBP`, `ftypavif`) and explicitly rejects PE (`MZ`), ELF (`7F 45 4C 46`), script shebangs (`#!`), and XML/HTML/SVG (`<`).
5. Cloudinary API secrets (`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) remain strictly server-only in `src/lib/cloudinary/config.js` and are never exposed to client bundles.

## Folder Organization & Deletion Ownership
- Allowed folders under `the-third-place/`: `branding`, `coffee`, `beverages`, `food`, `cafe-interior`, `events`, `community`, `gallery`.
- `DELETE /api/upload` and `deleteCloudinaryImage()` enforce that `publicId` must start with `the-third-place/` and contain no path traversal (`..`).

## Delivery & Optimization
- Public images are served over HTTPS via `res.cloudinary.com` with `f_auto,q_auto` transformations (`src/lib/cloudinary/url.js`) and Next.js `<Image>` AVIF/WebP optimization.
- Note: Public café photography delivery URLs are intentionally public; only upload, replacement, and deletion are restricted to administrators.
