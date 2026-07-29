import type { GlobalRole } from "@/lib/generated/prisma/client";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Config dasar TANPA callback yang menyentuh Prisma — sengaja dipisah dari
 * lib/auth.ts agar bisa dipakai middleware.ts (berjalan di Edge Runtime).
 * Prisma + driver `pg` memakai API Node.js yang tidak didukung Edge Runtime;
 * mengimpornya secara transitif dari middleware akan membuat build gagal.
 *
 * Callback `session` ikut ditaruh di sini (bukan di lib/auth.ts) karena ia
 * murni membaca field dari `token` (sudah diisi callback `jwt` di lib/auth.ts
 * saat login) — tidak ada query Prisma sama sekali. Dengan begitu middleware
 * dan auth() di Server Component menghasilkan shape session yang IDENTIK,
 * bukan cuma sama-sama "ada session atau tidak".
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.role as GlobalRole | null;
      return session;
    },
  },
} satisfies NextAuthConfig;
