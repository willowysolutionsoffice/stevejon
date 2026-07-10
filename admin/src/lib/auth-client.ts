// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000",
  basePath: "/api/auth-admin",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});