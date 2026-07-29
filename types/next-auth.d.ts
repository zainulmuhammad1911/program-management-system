import { DefaultSession } from "next-auth";
import { GlobalRole } from "@/lib/generated/prisma/client";

// Module augmentation — diisi T1.2 setelah model User & GlobalRole tersedia.

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: GlobalRole | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: GlobalRole | null;
  }
}
