// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  basePath: "/api/auth-admin",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});