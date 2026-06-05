import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins/admin';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mongodb',
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: true,
      },
      branch: {
        type: 'string',
        required: false,
        input: true,
      },
      phone: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  plugins: [
    admin({
      adminRoles: ['admin'],
    }),
  ],
});
