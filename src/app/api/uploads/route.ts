import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { db } from "@/db";
import { footScans } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Footprint image file is required." }, { status: 400 });
    }

    const userId = formData.get("userId");
    const notes = formData.get("notes");

    const profile = {
      age: formData.get("age"),
      weight: formData.get("weight"),
      activity: formData.get("activity"),
      issues: formData.get("issues"),
      email: formData.get("email"),
    };

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("[upload] Missing BLOB_READ_WRITE_TOKEN – uploads will fail.");
    }

    const safeName = file.name.replace(/\s+/g, "_");
    const blobPath = `footprints/${randomUUID()}-${safeName}`;

    const blob = await put(blobPath, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const inserted = await db
      .insert(footScans)
      .values({
        userId: typeof userId === "string" && userId.length > 0 ? userId : null,
        imageUrl: blob.url,
        thumbnailUrl: blob.url,
        notes: typeof notes === "string" && notes.length > 0 ? notes : null,
        rawAnalysis: profile,
      })
      .returning({ id: footScans.id, imageUrl: footScans.imageUrl });

    const record = inserted[0];

    return NextResponse.json(
      {
        scanId: record.id,
        imageUrl: record.imageUrl,
        uploadUrl: blob.url,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[upload] unexpected error", error);
    return NextResponse.json({ error: "Unable to process upload." }, { status: 500 });
  }
}

