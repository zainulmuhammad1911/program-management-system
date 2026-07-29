import NextAuth from "next-auth";
import type { GlobalRole } from "@/lib/generated/prisma/client";
import { authConfig } from "@/lib/auth.config";
import {
  recordSuccessfulLogin,
  resolveUserForSignIn,
  type SignInDenialReason,
} from "@/features/auth/services/user-auth.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.sub || !profile.email) return false;

      const result = await resolveUserForSignIn({
        providerAccountId: profile.sub,
        email: profile.email,
        emailVerified: Boolean(profile.email_verified),
        name: profile.name ?? null,
        image: typeof profile.picture === "string" ? profile.picture : null,
      });

      if (result.allowed) return true;

      const reason: SignInDenialReason = result.reason;
      return `/login?error=${reason}`;
    },

    async jwt({ token, account }) {
      if (account) {
        const user = await recordSuccessfulLogin(
          account.providerAccountId as string,
        );
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.role = token.role as GlobalRole | null;
      return session;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
});
