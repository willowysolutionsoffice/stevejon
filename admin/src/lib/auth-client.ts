// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/lib/auth';
import { adminClient } from 'better-auth/client/plugins';

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_API_URL).origin;
    } catch {
      return "http://localhost:5000";
    }
  }
  return "http://localhost:5000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
