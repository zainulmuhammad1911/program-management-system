"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/features/auth/services/authorization.service";
import type { GlobalRole } from "@/lib/generated/prisma/client";

export type UpdateGlobalRoleResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Mutasi GlobalRole satu user. Mengecek ulang otorisasi DI DALAM Server
 * Action ini sendiri (bukan cuma andalkan guard di halaman) — Server Action
 * adalah endpoint yang bisa dipanggil langsung, jadi guard di UI saja tidak
 * cukup. Juga menolak menghapus ADMIN terakhir di sistem (fail-closed).
 */
export async function updateGlobalRole(
  userId: string,
  newRole: GlobalRole | null,
): Promise<UpdateGlobalRoleResult> {
  const session = await auth();

  if (!hasRole(session?.user.role ?? null, "ADMIN")) {
    return { ok: false, error: "Anda tidak memiliki izin untuk aksi ini." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!target) {
    return { ok: false, error: "User tidak ditemukan." };
  }

  if (target.role === "ADMIN" && newRole === null) {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return {
        ok: false,
        error: "Tidak bisa menghapus Admin terakhir di sistem.",
      };
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}
