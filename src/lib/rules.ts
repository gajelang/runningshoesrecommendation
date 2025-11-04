import type { FootprintAnalysis, FootprintProfile } from "@/lib/openai";

export type ShoeCategory = "neutral" | "stability" | "motion-control" | "cushioned" | "trail" | "balanced";

export interface RecommendationRule {
  category: ShoeCategory;
  rationale: string;
  priority: number;
}

export interface RecommendationPlan {
  summary: string;
  confidence: number;
  categories: RecommendationRule[];
  signals: {
    archType: string;
    pronationType: string;
    activity?: string;
    issues?: string;
  };
}

const CATEGORY_PRIORITY: Record<ShoeCategory, number> = {
  "motion-control": 95,
  stability: 90,
  cushioned: 85,
  neutral: 80,
  balanced: 70,
  trail: 65,
};

export function buildRecommendationPlan(
  analysis: FootprintAnalysis,
  profile: FootprintProfile,
): RecommendationPlan {
  const categories: RecommendationRule[] = [];

  const summary = `Arch ${analysis.archType}, pronation ${analysis.pronationType}`;
  const averageConfidence = Math.round(
    (analysis.archConfidence + analysis.pronationConfidence) / 2,
  );

  if (analysis.pronationType === "overpronation" || analysis.archType === "flat") {
    categories.push({
      category: "stability",
      rationale:
        "Stability trainers slow excessive inward rolling and support lower arches detected in your footprint.",
      priority: CATEGORY_PRIORITY.stability,
    });
    if (analysis.archType === "flat") {
      categories.push({
        category: "motion-control",
        rationale:
          "Motion-control shoes add medial posting for very low arches, helping maintain alignment through stance.",
        priority: CATEGORY_PRIORITY["motion-control"],
      });
    }
  }

  if (analysis.pronationType === "underpronation" || analysis.pronationType === "neutral") {
    categories.push({
      category: "cushioned",
      rationale:
        "Soft, max-cushion trainers absorb impact for your gait pattern and protect joints during longer runs.",
      priority: CATEGORY_PRIORITY.cushioned,
    });
  }

  if (analysis.pronationType === "neutral") {
    categories.push({
      category: "neutral",
      rationale:
        "Neutral daily trainers balance cushioning and flexibility, matching the balanced motion detected by AI.",
      priority: CATEGORY_PRIORITY.neutral,
    });
  }

  if (categories.length === 0) {
    categories.push({
      category: "balanced",
      rationale:
        "Balanced shoes offer moderate cushioning and support when gait signals sit between stability and neutral.",
      priority: CATEGORY_PRIORITY.balanced,
    });
  }

  // Adjust priorities based on context
  if (profile.activity === "competitive") {
    categories.forEach((rule) => {
      rule.rationale += " Tuned for higher training loads requested in your profile.";
      rule.priority += 5;
    });
  }

  if (profile.issues && /trail/i.test(profile.issues)) {
    categories.push({
      category: "trail",
      rationale: "Trail shoes provide grip and protection mentioned in your notes.",
      priority: CATEGORY_PRIORITY.trail,
    });
  }

  categories.sort((a, b) => b.priority - a.priority);

  return {
    summary,
    confidence: averageConfidence,
    categories,
    signals: {
      archType: analysis.archType,
      pronationType: analysis.pronationType,
      activity: profile.activity ?? undefined,
      issues: profile.issues ?? undefined,
    },
  };
}

