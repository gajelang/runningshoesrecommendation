import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local", override: true });
loadEnv();

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";

type RecordRow = Record<string, string>;

interface ShoeRecord {
  slug: string;
  brand: string;
  model: string;
  category: string;
  cushioning?: string | null;
  stability?: string | null;
  stackHeightMm?: number | null;
  dropMm?: number | null;
  features?: Record<string, unknown>;
  tags?: string[];
}

const CSV_PATH = resolve(process.cwd(), "docs/runrepeat_running_shoes.csv");

if (!existsSync(CSV_PATH)) {
  console.error(`[seed] File not found at ${CSV_PATH}`);
  process.exit(1);
}

function parseNumber(input?: string | null): number | null {
  if (!input) return null;
  const cleaned = input.replace(/[^0-9\-.]+/g, "");
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  return Number.isNaN(value) ? null : value;
}

function asArray(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normaliseTag(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function determineCategory(pronationSupport: string[], terrain: string[]): string {
  if (terrain.some((item) => /trail/i.test(item))) {
    return "trail";
  }

  if (pronationSupport.some((item) => /overpronation|motion-control|severe/i.test(item))) {
    return "stability";
  }

  if (pronationSupport.some((item) => /supination|underpronation/i.test(item))) {
    return "cushioned";
  }

  return "neutral";
}

function buildCushioningText(model: string, midsoleSoftness: number | null, energyReturn: number | null): string {
  const parts: string[] = [];
  if (midsoleSoftness !== null) {
    parts.push(`Softness ${midsoleSoftness.toFixed(1)} HA`);
  }
  if (energyReturn !== null) {
    parts.push(`Energy return ${energyReturn.toFixed(1)}%`);
  }
  if (parts.length === 0) return `${model} cushioning`;
  return `${model} cushioning (${parts.join(", ")})`;
}

function buildStabilityText(pronationSupport: string[]): string | null {
  if (pronationSupport.length === 0) return null;
  return `Suitable for ${pronationSupport.join(", ")}`;
}

function mapRow(row: RecordRow): ShoeRecord {
  const terrain = asArray(row.terrain);
  const useCase = asArray(row.use_case);
  const pronationSupport = asArray(row.pronation_support);
  const archType = asArray(row.arch_type);
  const strikePattern = asArray(row.strike_pattern);
  const pace = asArray(row.pace_recommendation);
  const featuresSpecial = asArray(row.features_special);
  const widths = asArray(row.widths_available);
  const materials = asArray(row.material);
  const typeTags = asArray(row.type_tags);
  const season = asArray(row.season);

  const stackHeel = parseNumber(row.stack_height_mm_heel);
  const drop = parseNumber(row.drop_mm);
  const midsoleSoftness = parseNumber(row.midsole_softness_HA);
  const midsoleSoftnessCold = parseNumber(row.midsole_softness_in_cold_HA);
  const midsoleColdPct = parseNumber(row.midsole_softness_in_cold_pct);
  const shockHeel = parseNumber(row.shock_absorption_SA_heel);
  const shockForefoot = parseNumber(row.shock_absorption_SA_forefoot);
  const energyHeel = parseNumber(row.energy_return_pct_heel);
  const energyForefoot = parseNumber(row.energy_return_pct_forefoot);
  const weight = parseNumber(row.weight_g);
  const widthForefoot = parseNumber(row.platform_width_mm_forefoot);
  const widthHeel = parseNumber(row.platform_width_mm_heel);
  const breathability = parseNumber(row.breathability_score);
  const traction = parseNumber(row.traction_wet_score);
  const flex = parseNumber(row.flexibility_force_N);
  const stiffnessCold = parseNumber(row.stiffness_in_cold_N);
  const coldPct = parseNumber(row.cold_stiffness_change_pct);
  const durabilityToebox = parseNumber(row.durability_toebox_score);
  const durabilityHeel = parseNumber(row.durability_heel_score);
  const durabilityOutsole = parseNumber(row.durability_outsole_wear_mm);
  const outsoleThickness = parseNumber(row.outsole_thickness_mm);
  const outsoleHardness = parseNumber(row.outsole_hardness_HC);
  const insoleThickness = parseNumber(row.insole_thickness_mm);
  const tonguePadding = parseNumber(row.tongue_padding_mm);
  const widthFit = parseNumber(row.width_fit_mm_new);
  const toeboxWidth = parseNumber(row.toebox_width_mm_new);
  const toeboxHeight = parseNumber(row.toebox_height_mm);

  const category = determineCategory(pronationSupport, terrain);
  const cushioning = buildCushioningText(row.model, midsoleSoftness, energyHeel);
  const stability = buildStabilityText(pronationSupport);

  const tagsSet = new Set<string>();
  [...typeTags, ...featuresSpecial, ...useCase, ...pace].forEach((item) => {
    if (!item) return;
    tagsSet.add(item);
  });
  const tags = Array.from(tagsSet)
    .map((item) => normaliseTag(item))
    .filter(Boolean);

  const features = {
    terrain,
    useCase,
    pronationSupport,
    archType,
    strikePattern,
    paceRecommendation: pace,
    featuresSpecial,
    season,
    widthsAvailable: widths,
    materials,
    typeTags,
    condition: row.condition || null,
    price: {
      value: parseNumber(row.price_value),
      currency: row.price_currency || null,
    },
    metrics: {
      stackHeightMm: { heel: stackHeel, forefoot: parseNumber(row.stack_height_mm_forefoot) },
      dropMm: drop,
      midsoleSoftnessHa: midsoleSoftness,
      midsoleSoftnessInColdHa: midsoleSoftnessCold,
      midsoleSoftnessInColdPct: midsoleColdPct,
      shockAbsorptionSa: { heel: shockHeel, forefoot: shockForefoot },
      energyReturnPct: { heel: energyHeel, forefoot: energyForefoot },
      weightGrams: weight,
      widthMm: { forefoot: widthForefoot, heel: widthHeel },
      breathabilityScore: breathability,
      tractionWetScore: traction,
      flexibilityForceN: flex,
      stiffnessInColdN: stiffnessCold,
      coldStiffnessChangePct: coldPct,
      durability: {
        toeboxScore: durabilityToebox,
        heelPaddingScore: durabilityHeel,
        outsoleWearMm: durabilityOutsole,
      },
      outsoleThicknessMm: outsoleThickness,
      outsoleHardnessHc: outsoleHardness,
      insoleThicknessMm: insoleThickness,
      tonguePaddingMm: tonguePadding,
      toeboxDimensionsMm: {
        width: toeboxWidth,
        height: toeboxHeight,
        widthFit: widthFit,
      },
    },
    reviewers: {
      verdict: row.verdict_summary || null,
      audienceScore: parseNumber(row.audience_score),
    },
    pros: asArray(row.pros),
    cons: asArray(row.cons),
    whoShouldBuy: asArray(row.who_should_buy),
    whoShouldNotBuy: asArray(row.who_should_not_buy),
    metadata: {
      tongueGusset: row.tongue_gusset || null,
      heelTab: row.heel_tab || null,
      removableInsole: row.removable_insole || null,
      orthoticFriendly: row.orthotic_friendly || null,
      breathabilityRating: row.breathability_rating || null,
      torsionalRigidityRating: row.torsional_rigidity_rating || null,
      heelCounterStiffnessRating: row.heel_counter_stiffness_rating || null,
      reflectiveElements: row.reflective_elements || null,
    },
  };

  return {
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    category,
    cushioning,
    stability,
    stackHeightMm: stackHeel ? Math.round(stackHeel) : null,
    dropMm: drop ? Math.round(drop) : null,
    features,
    tags,
  };
}

async function main() {
  const { db } = await import("../src/db/index");
  const { shoeCatalog } = await import("../src/db/schema");
  const raw = readFileSync(CSV_PATH, "utf8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as RecordRow[];

  let success = 0;
  for (const row of rows) {
    if (!row.slug) continue;
    const mapped = mapRow(row);
    const payload: ShoeRecord = {
      ...mapped,
      features: mapped.features,
      tags: mapped.tags,
    };

    await db
      .insert(shoeCatalog)
      .values(payload)
      .onConflictDoUpdate({
        target: shoeCatalog.slug,
        set: {
          brand: payload.brand,
          model: payload.model,
          category: payload.category,
          cushioning: payload.cushioning,
          stability: payload.stability,
          stackHeightMm: payload.stackHeightMm ?? null,
          dropMm: payload.dropMm ?? null,
          features: payload.features,
          tags: payload.tags,
        },
      });
    success += 1;
  }

  console.log(`[seed] Upserted ${success} shoes into shoe_catalog`);
  process.exit(0);
}

main().catch((error) => {
  console.error("[seed] Failed to import shoes", error);
  process.exit(1);
});
