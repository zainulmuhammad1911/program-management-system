import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

/**
 * TANGGUNG JAWAB middleware ini — HANYA satu: authentication gate.
 * Mengecek "apakah ada session valid atau tidak", tidak lebih.
 *
 * BUKAN tanggung jawab middleware ini (jangan tambahkan di sini nanti):
 * - Authorization berbasis role (mis. cek `session.user.role === "ADMIN"`).
 *   Itu scope T1.4 (`hasRole()`), dijalankan di Server Component/Action.
 * - Authorization berbasis ProgramAssignment (akses ke Program tertentu).
 *   Itu scope T2.4, juga di Server Component/Action — BUKAN di sini.
 * - Query database apa pun. Middleware berjalan di Edge Runtime, yang
 *   tidak mendukung Prisma/driver `pg` (lihat komentar di auth.config.ts).
 *   `role` yang terbaca di sini adalah SNAPSHOT dari JWT saat login —
 *   bukan hasil query real-time — dan itu memang disengaja (trade-off yang
 *   diterima demi menjaga middleware tetap stateless & edge-compatible).
 *
 * Jika kebutuhan otorisasi bertambah kompleks di masa depan, tambahkan
 * lapisan BARU di Server Component/Action — jangan perluas middleware ini.
 */

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
