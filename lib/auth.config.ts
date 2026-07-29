import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Config dasar TANPA callback yang menyentuh Prisma — sengaja dipisah dari
 * lib/auth.ts agar bisa dipakai middleware.ts (berjalan di Edge Runtime).
 * Prisma + driver `pg` memakai API Node.js yang tidak didukung Edge Runtime;
 * mengimpornya secara transitif dari middleware akan membuat build gagal.
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
} satisfies NextAuthConfig;
