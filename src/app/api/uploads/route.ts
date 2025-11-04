import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import sharp from "sharp";

import { db } from "@/db";
import { footScans, recommendations, shoeCatalog, users } from "@/db/schema";
import { analyzeFootprintImage, type FootprintAnalysis } from "@/lib/openai";
import { buildRecommendationPlan } from "@/lib/rules";
import type { RecommendationMetadata, ShoeFeatures } from "@/lib/types";

function asShoeFeatures(value: unknown): ShoeFeatures {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as ShoeFeatures;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Footprint image file is required." }, { status: 400 });
    }

    const depth = formData.get("depth");
    const userId = formData.get("userId");
    const notes = formData.get("notes");

    const profile = {
      age: formData.get("age"),
      weight: formData.get("weight"),
      activity: formData.get("activity"),
      issues: formData.get("issues"),
      email: formData.get("email"),
    };

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const base64Image = fileBuffer.toString("base64");
    const mimeType = file.type || "image/png";

    let depthBase64: string | null = null;
    let depthStats: {
      min: number;
      max: number;
      mean: number;
      width: number;
      height: number;
    } | null = null;

    if (depth && depth instanceof File && depth.size > 0) {
      try {
        const depthArray = await depth.arrayBuffer();
        const depthBuffer = Buffer.from(depthArray);
        const depthImage = sharp(depthBuffer, { animated: false }).greyscale();
        const normalized = depthImage.normalize();
        const { data, info } = await normalized
          .raw()
          .toBuffer({ resolveWithObject: true });

        let min = 255;
        let max = 0;
        let sum = 0;

        for (const value of data) {
          const v = value as number;
          if (v < min) min = v;
          if (v > max) max = v;
          sum += v;
        }

        const channels = info.channels ?? 1;
        const pngBuffer = await sharp(data, {
          raw: { width: info.width, height: info.height, channels },
        })
          .png()
          .toBuffer();

        depthBase64 = pngBuffer.toString("base64");
        depthStats = {
          min,
          max,
          mean: Number((sum / data.length).toFixed(2)),
          width: info.width,
          height: info.height,
        };
      } catch (error) {
        console.warn("[upload] Unable to process depth map attachment", error);
      }
    }

    let resolvedUserId: string | null = null;
    const email =
      typeof profile.email === "string" && profile.email.trim().length > 0
        ? profile.email.trim().toLowerCase()
        : "";

    if (email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        resolvedUserId = existingUser.id;
      } else {
        const insertedUser = await db
          .insert(users)
          .values({ email })
          .onConflictDoNothing({ target: users.email })
          .returning({ id: users.id });

        if (insertedUser[0]) {
          resolvedUserId = insertedUser[0].id;
        } else {
          const fallback = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          resolvedUserId = fallback?.id ?? null;
        }
      }
    }

    const depthProvided = depth instanceof File && depth.size > 0;
    const scanType = depthProvided ? "lidar" : "photo";

    const initialRawAnalysis: Record<string, unknown> = {
      profile,
    };

    if (depthStats) {
      initialRawAnalysis.depthSummary = { stats: depthStats };
    }

    const inserted = await db
      .insert(footScans)
      .values({
        userId:
          typeof userId === "string" && userId.length > 0
            ? userId
            : resolvedUserId,
        imageUrl: "inline-upload",
        thumbnailUrl: null,
        scanType,
        depthMapUrl: depthBase64 ? "inline-depth" : null,
        artifactUrls: depthBase64 ? { depth: "inline-depth" } : null,
        notes: typeof notes === "string" && notes.length > 0 ? notes : null,
        rawAnalysis: initialRawAnalysis,
      })
      .returning({
        id: footScans.id,
        imageUrl: footScans.imageUrl,
        scanType: footScans.scanType,
      });

    const record = inserted[0];

    let analysisSummary: FootprintAnalysis | null = null;
    let plan: ReturnType<typeof buildRecommendationPlan> | null = null;
    let createdRecommendations: Array<{ id: string; category: string; matchPercent: number }> = [];

    try {
      const aiResult = await analyzeFootprintImage({
        imageBase64: base64Image,
        mimeType,
        profile,
        auxiliaryImages: depthBase64
          ? [
              {
                imageBase64: depthBase64,
                mimeType: "image/png",
                label: "Depth map attachment",
              },
            ]
          : undefined,
      });
      analysisSummary = aiResult;
      plan = buildRecommendationPlan(aiResult, profile);

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
            ...(depthStats
              ? {
                  depthSummary: {
                    stats: depthStats,
                    notes: "Depth map processed from LiDAR attachment.",
                  },
                }
              : {}),
            ai: aiResult,
            plan,
          },
        })
        .where(eq(footScans.id, record.id));

      const planCategories = plan?.categories ?? [];
      const candidateCategories = planCategories.map((rule) => rule.category);

      const shoes =
        candidateCategories.length > 0
          ? await db
              .select()
              .from(shoeCatalog)
              .where(inArray(shoeCatalog.category, Array.from(new Set(candidateCategories))))
          : await db.select().from(shoeCatalog).limit(12);

      const ranked = shoes
        .map((shoe) => {
          const features = asShoeFeatures(shoe.features);
          const rule = planCategories.find((item) => item.category === shoe.category);
          let score = rule?.priority ?? 60;
          const signals: string[] = [];

          const pronationMatches = new Set((features.pronationSupport ?? []).map((item) => item.toLowerCase()));
          if (pronationMatches.has(aiResult.pronationType.toLowerCase())) {
            score += 12;
            signals.push("pronation match");
          }

          const archMatches = new Set((features.archType ?? []).map((item) => item.toLowerCase()));
          if (archMatches.has(aiResult.archType.toLowerCase())) {
            score += 10;
            signals.push("arch match");
          }

          const useCases = new Set((features.useCase ?? []).map((item) => item.toLowerCase()));
          if (profile.activity && useCases.size > 0) {
            if (
              (profile.activity === "competitive" && useCases.has("tempo")) ||
              (profile.activity === "active" && useCases.has("daily running"))
            ) {
              score += 6;
              signals.push("use-case match");
            }
          }

          const metrics = features.metrics ?? {};
          const weight = (metrics?.weightGrams as number | null) ?? null;
          if (weight && profile.activity === "competitive" && weight > 280) {
            score -= 6;
            signals.push("heavy penalty");
          }

          const matchPercent = Math.max(50, Math.min(100, Math.round(score)));

          return {
            shoe,
            score,
            matchPercent,
            signals,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (ranked.length > 0) {
        const insertedRecommendations = await db
          .insert(recommendations)
          .values(
            ranked.map((item) => ({
              footScanId: record.id,
              shoeId: item.shoe.id,
              category: item.shoe.category,
              rationale:
                planCategories.find((rule) => rule.category === item.shoe.category)?.rationale ??
                "Matches your gait profile.",
              confidenceScore: plan?.confidence,
              metadata: {
                matchPercent: item.matchPercent,
                score: item.score,
                signals: item.signals,
                summary: plan?.summary,
                shoeSnapshot: {
                  brand: item.shoe.brand,
                  model: item.shoe.model,
                  cushioning: item.shoe.cushioning,
                  stability: item.shoe.stability,
                  features: item.shoe.features,
                  tags: item.shoe.tags,
                },
              } as RecommendationMetadata,
            })),
          )
          .returning({
            id: recommendations.id,
            category: recommendations.category,
          });

        createdRecommendations = insertedRecommendations.map((item, index) => ({
          id: item.id,
          category: item.category,
          matchPercent: ranked[index]?.matchPercent ?? 0,
        }));
      }
    } catch (analysisError) {
      console.error("[upload] GPT Vision analysis failed", analysisError);
      await db
        .update(footScans)
        .set({
          rawAnalysis: {
            profile,
            ...(depthStats
              ? {
                  depthSummary: {
                    stats: depthStats,
                    notes: "Depth map processed from LiDAR attachment.",
                  },
                }
              : {}),
            aiError: analysisError instanceof Error ? analysisError.message : "Unknown analysis error",
          },
        })
        .where(eq(footScans.id, record.id));
    }

    return NextResponse.json(
      {
        scanId: record.id,
        imageUrl: record.imageUrl,
        scanType: scanType,
        depthSummary: depthStats ? { stats: depthStats } : null,
        analysis: analysisSummary,
        plan,
        recommendations: createdRecommendations,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[upload] unexpected error", error);
    return NextResponse.json({ error: "Unable to process upload." }, { status: 500 });
  }
}
