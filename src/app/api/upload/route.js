import { NextResponse } from "next/server";
import { getCurrentAdmin, hasPermission } from "@/lib/supabase/admin";
import {
  CLOUDINARY_FOLDERS,
  deleteCloudinaryImage,
  isCloudinaryConfigured,
  uploadImageBuffer,
} from "@/lib/cloudinary/config";
import { validateUploadedImage } from "@/lib/security/fileValidation";
import { checkRateLimit, verifySameOrigin } from "@/lib/security/rateLimit";
import { PERMISSIONS } from "@/lib/security/permissions";
import { logAuditEvent } from "@/lib/security/audit";

const OWNED_PREFIX = "the-third-place/";

export async function POST(request) {
  try {
    if (!(await verifySameOrigin())) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const admin = await getCurrentAdmin();
    if (!admin || !hasPermission(admin.profile.role, PERMISSIONS.MANAGE_UPLOADS)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rate = checkRateLimit(`upload:${admin.user.id}`, {
      limit: 25,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait a moment and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Image upload service is not configured." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "gallery");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateUploadedImage({
      buffer,
      filename: file.name || "",
      mimeType: file.type || "",
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const safeFolder = CLOUDINARY_FOLDERS.includes(folder) ? folder : "gallery";
    const uploaded = await uploadImageBuffer(buffer, safeFolder);

    await logAuditEvent({
      actorId: admin.user.id,
      action: "cloudinary.upload",
      resourceType: "image",
      resourceId: uploaded.publicId,
      metadata: { folder: safeFolder, detectedMime: validation.detectedMime },
    });

    return NextResponse.json(uploaded, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    if (!(await verifySameOrigin())) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const admin = await getCurrentAdmin();
    if (!admin || !hasPermission(admin.profile.role, PERMISSIONS.MANAGE_UPLOADS)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const publicId = body?.publicId;

    if (
      !publicId ||
      typeof publicId !== "string" ||
      !publicId.startsWith(OWNED_PREFIX) ||
      publicId.includes("..")
    ) {
      return NextResponse.json(
        { error: "Invalid or unauthorized image identifier." },
        { status: 400 }
      );
    }

    await deleteCloudinaryImage(publicId);

    await logAuditEvent({
      actorId: admin.user.id,
      action: "cloudinary.delete",
      resourceType: "image",
      resourceId: publicId,
    });

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete image." },
      { status: 500 }
    );
  }
}
