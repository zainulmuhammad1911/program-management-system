import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import {
  recordSuccessfulLogin,
  resolveUserForSignIn,
  type SignInDenialReason,
} from "@/features/auth/services/user-auth.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    // `session` sengaja TIDAK didefinisikan ulang di sini — dipakai dari
    // authConfig.callbacks (lihat lib/auth.config.ts) via spread di bawah,
    // supaya middleware.ts (yang hanya memakai authConfig) menghasilkan
    // shape session yang identik dengan auth() di sini.
    ...authConfig.callbacks,

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

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
});
