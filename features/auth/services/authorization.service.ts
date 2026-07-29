import type { GlobalRole } from "@/lib/generated/prisma/client";

/**
 * Pure function — tanpa I/O, tanpa Prisma. Sengaja menerima nilai `role`
 * mentah (bukan Session/User object) agar reusable untuk sumber data apa pun
 * (session.user.role, JWT token, hasil query langsung, dsb.) tanpa helper ini
 * terikat ke satu shape data tertentu.
 *
 * `role` boleh `null` (mis. user belum punya GlobalRole) — dalam kasus itu
 * selalu mengembalikan `false` (fail-closed, bukan default-allow).
 *
 * `canAccessProgram()` SENGAJA belum dibuat di T1.4 — ditunda ke T2.x setelah
 * model `Program` lengkap (FK ke ProgramAssignment ditambahkan di T2.4),
 * supaya signature-nya tidak perlu berubah begitu detail relasinya jelas.
 */
export function hasRole(
  role: GlobalRole | null,
  expected: GlobalRole,
): boolean {
  return role === expected;
}
