import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { SessionResponse } from "@/types/auth";
type SessionUserWithRole = {
  role?: string | null;
};
export async function middleware(request: NextRequest) {
  const baseURL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "https://stevejon-2vr4.onrender.com";

  const { data: session } = await betterFetch<SessionResponse>(
    "/api/auth-admin/get-session",
    {
      baseURL,
      headers: {    
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/sign-up",
    "/dashboard-login",
  ];

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL("/dashboard-login", request.url));
  }

  const user = session.user as SessionUserWithRole;

if (user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};