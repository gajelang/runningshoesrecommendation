import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("[openai] OPENAI_API_KEY is not set. Vision analysis will fail.");
}

export const openaiClient = new OpenAI({
  apiKey,
});

export interface FootprintProfile {
  age?: string;
  weight?: string;
  activity?: string;
  issues?: string;
  email?: string;
}

export interface FootprintAnalysis {
  archType: "flat" | "normal" | "high";
  pronationType: "overpronation" | "neutral" | "underpronation";
  archConfidence: number;
  pronationConfidence: number;
  measurements?: {
    archRatio?: number;
    heelWidthMm?: number;
    stanceWidthMm?: number;
  };
  additionalNotes?: string;
  rawText?: string;
}

const jsonSchema = {
  name: "footprint_analysis",
  schema: {
    type: "object",
    properties: {
      archType: {
        type: "string",
        enum: ["flat", "normal", "high"],
      },
      pronationType: {
        type: "string",
        enum: ["overpronation", "neutral", "underpronation"],
      },
      archConfidence: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      pronationConfidence: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      measurements: {
        type: "object",
        properties: {
          archRatio: { type: "number" },
          heelWidthMm: { type: "number" },
          stanceWidthMm: { type: "number" },
        },
        additionalProperties: false,
      },
      additionalNotes: {
        type: "string",
      },
    },
    required: ["archType", "pronationType", "archConfidence", "pronationConfidence"],
    additionalProperties: false,
  },
  strict: true,
} as const;

export async function analyzeFootprintImage({
  imageUrl,
  profile,
}: {
  imageUrl: string;
  profile: FootprintProfile;
}): Promise<FootprintAnalysis> {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const systemPrompt =
    "You are a biomechanical expert specializing in footprint analysis. Classify the supplied footprint into arch type and pronation type. Respond using the required JSON schema.";

  const profileDescription = [
    `Age: ${profile.age ?? "unknown"}`,
    `Weight: ${profile.weight ?? "unknown"}`,
    `Activity Level: ${profile.activity ?? "unknown"}`,
    `Issues: ${profile.issues ?? "none reported"}`,
  ].join("\n");

  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_schema", json_schema: jsonSchema },
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analyze this footprint to determine arch type and pronation. Runner profile:\n${profileDescription}`,
          },
          {
            type: "input_image",
            image_url: imageUrl,
          },
        ],
      },
    ],
  });

  const outputText = response.output_text;
  let parsed: FootprintAnalysis | null = null;
  try {
    parsed = JSON.parse(outputText) as FootprintAnalysis;
  } catch (error) {
    console.warn("[openai] Unable to parse JSON response. Returning fallback object.", error, outputText);
  }

  if (!parsed) {
    throw new Error("Failed to parse GPT Vision analysis.");
  }

  return {
    ...parsed,
    archConfidence: clamp(parsed.archConfidence),
    pronationConfidence: clamp(parsed.pronationConfidence),
    rawText: outputText,
  };
}

function clamp(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

