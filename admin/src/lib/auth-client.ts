// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "https://stevejon-2vr4.onrender.com",
  basePath: "/api/auth-admin",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});