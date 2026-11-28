import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  validateUploadedImage,
  MAX_IMAGE_BYTES,
} from "../src/lib/security/fileValidation.js";
import {
  hasPermission,
  isValidUuid,
  PERMISSIONS,
  ROLES,
  sanitizeRedirectPath,
} from "../src/lib/security/permissions.js";
import { checkRateLimit } from "../src/lib/security/rateLimit.js";
import { enquirySchema, menuItemSchema } from "../src/lib/utils/validation.js";

test("File validation accepts genuine JPEG, PNG, WebP, and AVIF headers", () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const webp = Buffer.from("RIFF1234WEBP0000");
  const avif = Buffer.from([0, 0, 0, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66]);

  assert.equal(validateUploadedImage({ buffer: jpeg, filename: "latte.jpg", mimeType: "image/jpeg" }).valid, true);
  assert.equal(validateUploadedImage({ buffer: png, filename: "logo.png", mimeType: "image/png" }).valid, true);
  assert.equal(validateUploadedImage({ buffer: webp, filename: "cafe.webp", mimeType: "image/webp" }).valid, true);
  assert.equal(validateUploadedImage({ buffer: avif, filename: "cake.avif", mimeType: "image/avif" }).valid, true);
});

test("File validation rejects executables, SVG/HTML XSS, fake extensions, and >10MB files", () => {
  const peExeSpoofedAsJpg = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0, 0, 0, 0, 0, 0, 0, 0]);
  const elfBinary = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 0, 0, 0, 0, 0, 0, 0, 0]);
  const svgXss = Buffer.from("<svg onload=alert(1)></svg>");
  const oversized = Buffer.alloc(MAX_IMAGE_BYTES + 1, 0xff);

  assert.equal(validateUploadedImage({ buffer: peExeSpoofedAsJpg, filename: "fake.jpg", mimeType: "image/jpeg" }).valid, false);
  assert.equal(validateUploadedImage({ buffer: elfBinary, filename: "shell.png", mimeType: "image/png" }).valid, false);
  assert.equal(validateUploadedImage({ buffer: svgXss, filename: "xss.png", mimeType: "image/png" }).valid, false);
  assert.equal(validateUploadedImage({ buffer: svgXss, filename: "xss.svg", mimeType: "image/svg+xml" }).valid, false);
  assert.equal(validateUploadedImage({ buffer: oversized, filename: "huge.jpg", mimeType: "image/jpeg" }).valid, false);
});

test("RBAC enforces strict role-permission boundaries", () => {
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.MANAGE_SETTINGS), true);
  assert.equal(hasPermission(ROLES.ADMIN, PERMISSIONS.MANAGE_ROLES), true);
  assert.equal(hasPermission(ROLES.EDITOR, PERMISSIONS.MANAGE_MENU), true);
  assert.equal(hasPermission(ROLES.EDITOR, PERMISSIONS.MANAGE_SETTINGS), false);
  assert.equal(hasPermission(ROLES.EDITOR, PERMISSIONS.MANAGE_ROLES), false);
  assert.equal(hasPermission(ROLES.STAFF, PERMISSIONS.MANAGE_MENU), false);
  assert.equal(hasPermission(ROLES.PUBLIC, PERMISSIONS.MANAGE_ENQUIRIES), false);
});

test("Open-redirect sanitizer blocks external and protocol-relative URLs", () => {
  assert.equal(sanitizeRedirectPath("/admin/menu"), "/admin/menu");
  assert.equal(sanitizeRedirectPath("https://evil.com/phish"), "/admin/dashboard");
  assert.equal(sanitizeRedirectPath("//evil.com"), "/admin/dashboard");
  assert.equal(sanitizeRedirectPath("/\\evil.com"), "/admin/dashboard");
});

test("UUID validator rejects SQLi and path traversal payloads", () => {
  assert.equal(isValidUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidUuid("' OR 1=1 --"), false);
  assert.equal(isValidUuid("../../etc/passwd"), false);
});

test("Rate limiter enforces request cap and returns retry-after", () => {
  const key = `test-rate-${Date.now()}`;
  assert.equal(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  assert.equal(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  const blocked = checkRateLimit(key, { limit: 2, windowMs: 60_000 });
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
});

test("Zod schemas reject malformed enquiries and invalid menu inputs", () => {
  const badEmail = enquirySchema.safeParse({
    name: "Test User",
    email: "not-an-email",
    topic: "General",
    message: "Hello there, testing validation.",
  });
  assert.equal(badEmail.success, false);

  const negativePrice = menuItemSchema.safeParse({
    category_id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Latte",
    price_lkr: -500,
  });
  assert.equal(negativePrice.success, false);
});

test("No client component references server-only secrets or service role", () => {
  function walk(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files = files.concat(walk(full));
      else if (entry.name.endsWith(".js")) files.push(full);
    }
    return files;
  }

  const srcFiles = walk(path.resolve("src"));
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, "utf8");
    const isClient = content.startsWith('"use client"') || content.startsWith("'use client'");
    if (isClient) {
      assert.equal(
        /SUPABASE_SERVICE_ROLE_KEY|CLOUDINARY_API_SECRET|createServiceRoleClient/.test(content),
        false,
        `Client component ${file} must never reference server-only secrets`
      );
    }
  }
});
