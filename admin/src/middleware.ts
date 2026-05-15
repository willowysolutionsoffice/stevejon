// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { SessionResponse } from "@/types/auth";

export async function middleware(request: NextRequest) {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

  const { data: session } = await betterFetch<SessionResponse>(
    "/api/auth/get-session",
    {
      baseURL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward cookies
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // Public routes (no session required)
  const publicRoutes = [
    "/login",
    "/sign-up",
    "/dashboard-login",
  ];

  const isPublic = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // If no session, redirect to login for protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/dashboard-login", request.url));
  }

  // ✅ Safe to destructure now
  const { user } = session;

  // All routes are now "admin" routes since we removed the user side
  if (user.role !== "admin" && pathname !== "/dashboard-login") {
    // For now, if not admin, we might want to redirect somewhere else, 
    // but since there's no user side, maybe just a simple message or logout.
    // For now, let's keep it restricted to admins.
    return NextResponse.redirect(new URL("/dashboard-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};
