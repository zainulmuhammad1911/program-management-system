import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Instance NextAuth TERPISAH dari lib/auth.ts — hanya memakai config edge-safe
// (tanpa callback yang menyentuh Prisma). Mendekode JWT yang sama tetap valid
// karena keduanya berbagi AUTH_SECRET & strategi session yang sama; middleware
// hanya perlu tahu "ada session atau tidak", bukan menjalankan logic DB.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
