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
  strict: false,
} as const;

export async function analyzeFootprintImage({
  imageUrl,
  imageBase64,
  mimeType,
  profile,
  auxiliaryImages,
}: {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  profile: FootprintProfile;
  auxiliaryImages?: Array<{
    imageBase64: string;
    mimeType: string;
    label?: string;
  }>;
}): Promise<FootprintAnalysis> {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  if (!imageUrl && !imageBase64) {
    throw new Error("Either imageUrl or imageBase64 must be provided.");
  }

  const systemPrompt = [
    "You are a biomechanical expert specializing in footprint analysis. Classify the supplied footprint into arch type and pronation type. Respond using the required JSON schema.",
    "If you are uncertain, re-evaluate heel width versus arch width before finalizing.",
    "Only output a confidence below 50 if, after re-checking, you still find the evidence inconclusive. When certain, keep confidence at or above 50.",
    "When a depth or height-map attachment is provided, use it to cross-check midfoot elevation and medial arch height before finalizing your answer.",
  ].join(" ");

  const profileDescription = [
    `Age: ${profile.age ?? "unknown"}`,
    `Weight: ${profile.weight ?? "unknown"}`,
    `Activity Level: ${profile.activity ?? "unknown"}`,
    `Issues: ${profile.issues ?? "none reported"}`,
  ].join("\n");

  const response = await openaiClient.responses.create({
    model: "gpt-4o-mini",
    text: {
      format: {
        type: "json_schema",
        ...jsonSchema,
      },
    },
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }],
      },
      (() => {
        const content: Array<{ type: "input_text"; text: string } | { type: "input_image"; image_url: string }> = [
          {
            type: "input_text",
            text: `Analyze this footprint to determine arch type and pronation. Re-check midfoot and heel area as needed before final answer.\nRunner profile:\n${profileDescription}${
              auxiliaryImages?.length
                ? "\nAdditional attachment: top-down depth map (use to validate arch height and stance width)."
                : ""
            }`,
          },
          imageUrl
            ? { type: "input_image", image_url: imageUrl }
            : {
                type: "input_image",
                image_url: `data:${mimeType ?? "image/png"};base64,${imageBase64}`,
              },
        ];

        if (auxiliaryImages?.length) {
          auxiliaryImages.forEach((attachment, index) => {
            const label = attachment.label ?? `Attachment ${index + 1}`;
            content.push({
              type: "input_text",
              text: `${label}: Interpret this as a height/depth visualization of the footprint. Use it to verify arch height, midfoot contact, and heel stability.`,
            });
            content.push({
              type: "input_image",
              image_url: `data:${attachment.mimeType};base64,${attachment.imageBase64}`,
            });
          });
        }

        return {
          role: "user" as const,
          content,
        };
      })(),
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
