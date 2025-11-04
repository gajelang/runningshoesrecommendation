import type { FootprintAnalysis, FootprintProfile } from "@/lib/openai";
import type { RecommendationPlan } from "@/lib/rules";

export interface ShoeFeatures {
  terrain?: string[];
  useCase?: string[];
  pronationSupport?: string[];
  archType?: string[];
  strikePattern?: string[];
  paceRecommendation?: string[];
  featuresSpecial?: string[];
  materials?: string[];
  typeTags?: string[];
  widthsAvailable?: string[];
  metrics?: {
    stackHeightMm?: { heel?: number | null; forefoot?: number | null };
    dropMm?: number | null;
    weightGrams?: number | null;
  } & Record<string, unknown>;
  pros?: string[];
  cons?: string[];
  [key: string]: unknown;
}

export interface RecommendationMetadata {
  matchPercent?: number;
  score?: number;
  signals?: string[];
  summary?: string;
  shoeSnapshot?: {
    brand?: string;
    model?: string;
    cushioning?: string | null;
    stability?: string | null;
    features?: ShoeFeatures;
    tags?: string[];
  };
}

export interface StoredAnalysis {
  profile?: FootprintProfile;
  ai?: FootprintAnalysis;
  plan?: RecommendationPlan;
  depthSummary?: {
    stats?: {
      min?: number;
      max?: number;
      mean?: number;
      width?: number;
      height?: number;
    };
    notes?: string;
  };
  [key: string]: unknown;
}
