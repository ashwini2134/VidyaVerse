import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function oauthStatus(id: string | undefined): string {
  return id ? `configured (${id.slice(0, 8)}...)` : "NOT configured";
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: (process.env.NODE_ENV ?? "development") !== "production",

  frontendUrl: required(
    "FRONTEND_URL",
    "http://localhost:5173/LMS"
  ),

  get databasePath() {
    return process.env.DATABASE_PATH ?? "./data/lms.db";
  },

  jwt: {
    accessSecret: required(
      "JWT_ACCESS_SECRET",
      "dev-access-secret-change-in-production-32chars"
    ),
    refreshSecret: required(
      "JWT_REFRESH_SECRET",
      "dev-refresh-secret-change-in-production-32chars"
    ),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
  },

  groqApiKey: process.env.GROQ_API_KEY ?? "",

  bharatCode: {
    apiKey: process.env.BHARATCODE_API_KEY ?? "",
    baseUrl: process.env.BHARATCODE_BASE_URL ?? "https://bharatcode.ai/api/model/v1",
    model: process.env.BHARATCODE_MODEL ?? "qwen-3.8-27b",
  },

  aiMentor: {
    qdrantUrl: process.env.QDRANT_URL ?? "http://localhost:6333",
    qdrantApiKey: process.env.QDRANT_API_KEY ?? "",
    openaiApiKey: process.env.OPENAI_API_KEY ?? "",
    lyzrApiKey: process.env.LYZR_API_KEY ?? "",
    lyzrWorkflowId: process.env.LYZR_WORKFLOW_ID ?? "",
    lyzrAgentId: process.env.LYZR_AGENT_ID?.trim() ?? "",
    omiApiKey: process.env.OMI_API_KEY ?? "",
    qdrantCollectionName:
      process.env.QDRANT_COLLECTION_NAME ?? "lms_learning_memory_384",
  },

  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      callbackUrl:
        process.env.GITHUB_CALLBACK_URL ??
        "http://localhost:3001/api/auth/oauth/github/callback",
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      callbackUrl:
        process.env.LINKEDIN_CALLBACK_URL ??
        "http://localhost:3001/api/auth/oauth/linkedin/callback",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackUrl:
        process.env.GOOGLE_CALLBACK_URL ??
        "http://localhost:3001/api/auth/oauth/google/callback",
    },
  },

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "noreply@gyansetu.academy",
  },
};

console.log(
  `[AI Mentor] Lyzr agent ID loaded: ${Boolean(config.aiMentor.lyzrAgentId)}`
);

console.log(
  `[config] OAuth status — Google: ${oauthStatus(process.env.GOOGLE_CLIENT_ID)}, GitHub: ${oauthStatus(process.env.GITHUB_CLIENT_ID)}, LinkedIn: ${oauthStatus(process.env.LINKEDIN_CLIENT_ID)}`
);

console.log(`[config] Frontend URL: ${config.frontendUrl}`);

console.log(
  `[config] Callback URLs — Google: ${config.oauth.google.callbackUrl}, GitHub: ${config.oauth.github.callbackUrl}, LinkedIn: ${config.oauth.linkedin.callbackUrl}`
);