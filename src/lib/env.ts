const requiredServerEnv = ["POSTGRES_URL"] as const;

for (const key of requiredServerEnv) {
  if (!process.env[key]) {
    const suffix =
      process.env.NODE_ENV === "production"
        ? "Deployment"
        : "Local development (`.env.local`)";
    console.warn(`[env] Missing ${key}. Set it in ${suffix}.`);
  }
}

export const env = {
  postgresUrl: process.env.POSTGRES_URL,
  postgresUrlNonPooling: process.env.POSTGRES_URL_NON_POOLING,
  openAIApiKey: process.env.OPENAI_API_KEY,
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
} as const;

