"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function seedAdminUser() {
  const email = "admin@gmail.com";
  const password = "12345678";
  const name = "Admin User";

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update role to admin if it's not
      await prisma.user.update({
        where: { email },
        data: { role: "admin" },
      });
      return { success: true, message: "Admin user already exists and role updated." };
    }

    // Create user using better-auth API
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "admin",
      },
    });

    if (result) {
        // Double check and ensure role is set in user table (better-auth might need extra plugin config for role during signup)
        await prisma.user.update({
            where: { email },
            data: { role: "admin" }
        })
      return { success: true, message: "Admin user created successfully." };
    }

    return { success: false, message: "Failed to create admin user." };
  } catch (error: any) {
    console.error("Error seeding admin:", error);
    return { success: false, message: error.message || "An error occurred." };
  }
}
