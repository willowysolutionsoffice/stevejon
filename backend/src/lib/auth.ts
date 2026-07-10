import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";
import { prisma } from "./prisma.js";

const trustedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
].filter(Boolean) as string[];

const commonConfig = {
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  user: {
    additionalFields: {
      role: {
        type: "string" as const,
        required: false,
        defaultValue: "user",
        input: true,
      },
      branch: {
        type: "string" as const,
        required: false,
        input: true,
      },
      phone: {
        type: "string" as const,
        required: false,
        input: true,
      },
    },
  },
};

export const webAuth = betterAuth({
  ...commonConfig,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth-web",
  advanced: {
    cookiePrefix: "stevejon-web",
  },
});

export const adminAuth = betterAuth({
  ...commonConfig,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth-admin",
  advanced: {
    cookiePrefix: "stevejon-admin",
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
    }),
  ],
});