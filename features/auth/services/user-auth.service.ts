import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

export interface ProviderProfile {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
}

export type SignInDenialReason =
  | "EmailNotVerified"
  | "AccountInactive"
  | "EmailMismatch"
  | "ProviderIdentityConflict";

export type ResolveSignInResult =
  | { allowed: true }
  | { allowed: false; reason: SignInDenialReason };

/**
 * Resolve identity untuk satu percobaan sign-in: cari/buat/link baris User,
 * dan validasi apakah login boleh dilanjutkan.
 *
 * Aturan pencarian & identitas (lihat prisma/schema.prisma untuk konteks):
 * - Begitu `providerAccountId` tersimpan pada suatu User, itulah SATU-SATUNYA
 *   kunci pencocokan untuk baris tsb — email hanya dibandingkan, tidak lagi
 *   dipakai untuk mencari.
 * - `email` hanya dipakai sebagai kunci pencarian pada: create pertama,
 *   linking pertama, dan pre-provisioning oleh Admin.
 */
export async function resolveUserForSignIn(
  profile: ProviderProfile,
): Promise<ResolveSignInResult> {
  if (!profile.emailVerified) {
    return { allowed: false, reason: "EmailNotVerified" };
  }

  const byProviderAccountId = await prisma.user.findUnique({
    where: { providerAccountId: profile.providerAccountId },
  });

  if (byProviderAccountId) {
    return handleReturningUser(byProviderAccountId, profile);
  }

  const byEmail = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (byEmail) {
    return handleLinkOrConflict(byEmail, profile);
  }

  return createNewUser(profile);
}

async function handleReturningUser(
  existing: { id: string; isActive: boolean; email: string; name: string | null; image: string | null },
  profile: ProviderProfile,
): Promise<ResolveSignInResult> {
  if (!existing.isActive) {
    return { allowed: false, reason: "AccountInactive" };
  }

  // Kebijakan konservatif: providerAccountId sudah jadi identitas utama,
  // email hanya dibandingkan — tidak pernah auto-update / merge di sini.
  if (existing.email !== profile.email) {
    return { allowed: false, reason: "EmailMismatch" };
  }

  const changes: Prisma.UserUpdateInput = {};
  if (existing.name !== profile.name) changes.name = profile.name;
  if (existing.image !== profile.image) changes.image = profile.image;

  if (Object.keys(changes).length > 0) {
    await prisma.user.update({ where: { id: existing.id }, data: changes });
  }

  return { allowed: true };
}

async function handleLinkOrConflict(
  existing: {
    id: string;
    isActive: boolean;
    providerAccountId: string | null;
    name: string | null;
    image: string | null;
  },
  profile: ProviderProfile,
): Promise<ResolveSignInResult> {
  if (!existing.isActive) {
    return { allowed: false, reason: "AccountInactive" };
  }

  if (
    existing.providerAccountId &&
    existing.providerAccountId !== profile.providerAccountId
  ) {
    // Email sama, tapi identitas provider berbeda dari yang tersimpan.
    // Sengaja TIDAK auto-link — butuh penanganan manual Admin.
    return { allowed: false, reason: "ProviderIdentityConflict" };
  }

  // Linking pertama: providerAccountId + name + image dalam SATU update.
  await prisma.user.update({
    where: { id: existing.id },
    data: {
      providerAccountId: profile.providerAccountId,
      name: profile.name,
      image: profile.image,
    },
  });

  return { allowed: true };
}

async function createNewUser(
  profile: ProviderProfile,
): Promise<ResolveSignInResult> {
  try {
    await prisma.user.create({
      data: {
        email: profile.email,
        providerAccountId: profile.providerAccountId,
        name: profile.name,
        image: profile.image,
      },
    });
    return { allowed: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Race condition: request lain sudah membuat/mengubah baris ini duluan.
      // Ulangi resolusi dari awal — sekarang pasti ketemu di salah satu jalur di atas.
      return resolveUserForSignIn(profile);
    }
    throw error;
  }
}

/**
 * Dipanggil dari callback `jwt` Auth.js, HANYA pada cabang login-awal
 * (setelah `signIn` menyetujui). Definisi `lastLoginAt`: waktu ketika Auth.js
 * telah memverifikasi autentikasi dan mengizinkan session dibuat — BUKAN waktu
 * cookie dipastikan tersimpan di browser (Auth.js tidak menyediakan hook untuk itu).
 */
export async function recordSuccessfulLogin(providerAccountId: string) {
  return prisma.user.update({
    where: { providerAccountId },
    data: { lastLoginAt: new Date() },
    select: { id: true, role: true },
  });
}
