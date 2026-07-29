# Implementation Plan
## Program Management System (PMS) — The Reform Initiatives

Prinsip: feature-by-feature, incremental, tim 1–3 developer, 1 sprint = 1 minggu. Setiap sprint harus menghasilkan sesuatu yang bisa didemokan.

Status per 2026-07-30. Legenda: ✅ selesai (committed & CI hijau) · 🔶 dirancang, menunggu implementasi · ⬜ belum dimulai.

---

## Fase 0 — Foundation

| Task | Deskripsi | Status |
|---|---|---|
| T0.1 | Next.js 15 + TypeScript + Tailwind v4 + ESLint + Prettier + `.editorconfig` | ✅ |
| T0.2 | PostgreSQL (docker-compose) + Prisma 7 + driver adapter `pg` | ✅ |
| T0.3 | Google OAuth foundation via Auth.js (JWT session, protected routes) | ✅ |
| T0.4 | GitHub Actions CI (lint + build, Node 22 LTS, cache npm) | ✅ |
| T0.5 | Staging environment | ⬜ |
| T0.6 | — (digabung ke T0.4 di eksekusi aktual) | — |

## Fase 1 — Program Structure & Identity (Sprint 1)

| Task | Deskripsi | Dependency | Status |
|---|---|---|---|
| T1.1 | Skema `User`, `ProgramAssignment` (`GlobalRole`, `ProgramRole` terpisah), migration pertama | T0.2 | ✅ |
| T1.2 | Create-on-first-login via callback Auth.js (`signIn`/`jwt`), service `user-auth.service.ts` | T0.3, T1.1 | ✅ |
| T1.3 | Unifikasi session shape middleware ↔ Server Component (`session()` callback dipindah ke `auth.config.ts`) | T1.2 | ✅ |
| T1.4 | Helper otorisasi `hasRole()`, `canAccessProgram()` — `features/auth/services/authorization.service.ts` | T1.1, T1.2, T1.3 | 🔶 dirancang |
| T1.5 | Halaman admin dasar: daftar user + set role global (ADMIN saja, sesuai simplifikasi `GlobalRole`) | T1.1, T1.3 | ⬜ |

## Fase 2 — Activity Template, Checklist & Progress Engine ⭐ (Kritis)

| Task | Deskripsi | Status |
|---|---|---|
| T4.1–T4.4 | Activity Template (Admin) — skema JSONB, builder UI, seed contoh | ⬜ |
| T5.1–T5.5 | Instantiation dari template + checklist toggle | ⬜ |
| T6.1–T6.5 | Progress calculation cascade + unit test formula | ⬜ |

## Fase 3 — RTL

| Task | Deskripsi | Status |
|---|---|---|
| T7.1–T7.4 | Skema RTL, CRUD, badge overdue, halaman "My Tasks" | ⬜ |

## Fase 4 — Document & Report

| Task | Deskripsi | Status |
|---|---|---|
| T8.1–T8.3 | Document Registry (link Google Drive) | ⬜ |
| T9.1–T9.4 | Report (lifecycle donor deliverable) | ⬜ |

## Fase 5 — Dashboard & Search

| Task | Deskripsi | Status |
|---|---|---|
| T10.1–T10.3 | Dashboard Program & Workspace (read-only) | ⬜ |
| T11.1–T11.3 | Global search + breadcrumb polish | ⬜ |

## Fase 6 — Audit Log & Hardening

| Task | Deskripsi | Status |
|---|---|---|
| T12.1–T12.3 | Audit log (`writeAuditLog()` langsung, bukan service formal) | ⬜ |
| T13.1–T13.4 | Error handling standar (`AppError`), security & permission audit | ⬜ |

## Fase 7 — UAT & Launch

| Task | Deskripsi | Status |
|---|---|---|
| T14.1–T14.4 | Internal UAT & bug fixing | ⬜ |
| T15.1–T15.4 | Deployment & go-live | ⬜ |

---

## Risk Register (Ringkasan, Lihat Riwayat Percakapan untuk Detail Penuh)

- Progress cascade (Fase 2) berisiko under-estimated — wajib unit test formula sebelum lanjut.
- Scope creep saat UAT — catat sebagai backlog, bukan langsung dikerjakan.
- Bus factor tinggi (tim 1–3 dev) — dokumentasi keputusan arsitektur (dokumen ini + Architecture Review) sengaja dijaga hidup untuk mitigasi.
- Activity Template builder (T4.2) berisiko under-estimated — mulai dengan UI sederhana, tunda drag-and-drop.
- Ambiguitas snapshot vs template — tampilkan versi template yang dipakai di UI Activity (belum relevan, Activity belum dibangun).

---

## Catatan Penyimpangan dari Rencana Awal (Insiden & Keputusan Nyata)

Dokumen ini hidup dan direvisi berdasarkan apa yang benar-benar terjadi selama implementasi, bukan hanya rencana di atas kertas:

1. **T0.2** — Docker Desktop tidak bisa diinstal otomatis (butuh password sudo interaktif); diinstal manual oleh user.
2. **T0.4** — Node 22 LTS dipilih (bukan Node 20 default `@types/node`) karena Node 20 sudah/segera EOL per tanggal implementasi.
3. **T1.1** — Revisi dua kali: pemisahan `GlobalRole`/`ProgramRole`, `googleId` → `providerAccountId` (provider-agnostic), simplifikasi `GlobalRole` jadi hanya `ADMIN` (role operasional sepenuhnya di `ProgramAssignment.roleInProgram`). Migration pertama di-reset bersih sekali (belum pernah di-push, aman) untuk menghindari 2 migration bertumpuk.
4. **T1.2** — Prisma v7 mewajibkan driver adapter (`@prisma/adapter-pg`), beda dari asumsi awal. Kebijakan email/provider-identity dibuat konservatif (tolak login pada mismatch, tidak auto-merge).
5. **T1.2/T1.3** — Insiden build: middleware (Edge Runtime) tidak bisa mengimpor Prisma/`pg` (Node-only API). Diperbaiki dengan memisah `lib/auth.config.ts` (edge-safe) dari `lib/auth.ts` (full, DB-backed callbacks) — pola resmi Auth.js untuk kombinasi middleware + adapter database.
