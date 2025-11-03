import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { footScans } from "@/db/schema";
import { analyzeFootprintImage } from "@/lib/openai";

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

    let analysisSummary: Awaited<ReturnType<typeof analyzeFootprintImage>> | null = null;

    try {
      const aiResult = await analyzeFootprintImage({
        imageUrl: blob.url,
        profile,
      });
      analysisSummary = aiResult;

      await db
        .update(footScans)
        .set({
          archType: aiResult.archType,
          pronationType: aiResult.pronationType,
          archConfidence: aiResult.archConfidence,
          pronationConfidence: aiResult.pronationConfidence,
          stanceWidthMm:
            typeof aiResult.measurements?.stanceWidthMm === "number"
              ? Math.round(aiResult.measurements.stanceWidthMm)
              : null,
          rawAnalysis: {
            profile,
            ai: aiResult,
          },
        })
        .where(eq(footScans.id, record.id));
    } catch (analysisError) {
      console.error("[upload] GPT Vision analysis failed", analysisError);
      await db
        .update(footScans)
        .set({
          rawAnalysis: {
            profile,
            aiError: analysisError instanceof Error ? analysisError.message : "Unknown analysis error",
          },
        })
        .where(eq(footScans.id, record.id));
    }

    return NextResponse.json(
      {
        scanId: record.id,
        imageUrl: record.imageUrl,
        uploadUrl: blob.url,
        analysis: analysisSummary,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[upload] unexpected error", error);
    return NextResponse.json({ error: "Unable to process upload." }, { status: 500 });
  }
}
