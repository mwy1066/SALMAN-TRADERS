import { NextResponse, type NextRequest } from "next/server";
import { createRouteAuth, privateResponse } from "@/lib/auth/response";
import { isProtectedPath } from "@/lib/auth/paths";

export async function proxy(request: NextRequest) {
  const protectedRoute = isProtectedPath(request.nextUrl.pathname);
  try {
    const { supabase, finish } = createRouteAuth(request);
    const { data, error } = await supabase.auth.getClaims();
    const valid = !error && data?.claims?.sub && !data.claims.is_anonymous;
    if (protectedRoute && !valid) {
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return finish(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
      }
      const destination = new URL("/login", request.url);
      destination.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
      return finish(NextResponse.redirect(destination));
    }
    return finish(NextResponse.next({ request }));
  } catch {
    if (protectedRoute) {
      return privateResponse(NextResponse.json({ error: "Sign-in is temporarily unavailable. Please try again." }, { status: 503 }));
    }
    return privateResponse(NextResponse.next({ request }));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/account/:path*", "/dashboard/:path*", "/api/account/:path*", "/login", "/signup", "/forgot-password", "/auth/:path*"],
};
