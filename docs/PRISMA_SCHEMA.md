# Prisma Schema Snapshot (untuk Knowledge Graph Indexing)

> Salinan `prisma/schema.prisma` per 2026-07-30, dibuat khusus agar ter-index oleh graphify
> (ekstensi `.prisma` tidak dikenali graphify sebagai code maupun document).
> **Sumber kebenaran tetap `prisma/schema.prisma`** — file ini hanya cermin untuk indexing,
> bukan dokumen yang di-maintain terpisah.

## Datasource & Generator

- `generator client` → provider `prisma-client`, output `../lib/generated/prisma`
- `datasource db` → provider `postgresql`

## Enum `GlobalRole`

Hanya berisi `ADMIN`. Role operasional (Program Manager/Program Officer) sepenuhnya berada di `ProgramAssignment.roleInProgram`, bukan di sini — keputusan T1.1.

## Enum `ProgramRole`

`PROGRAM_MANAGER`, `PROGRAM_OFFICER`.

## Model `User`

| Field | Tipe | Catatan |
|---|---|---|
| `id` | `String @id @default(uuid())` | |
| `email` | `String @unique` | Identitas login utama saat create/link pertama |
| `name` | `String?` | Dari profil Google, timpa hanya jika berubah |
| `image` | `String?` | Dari profil Google, timpa hanya jika berubah |
| `providerAccountId` | `String? @unique` | `sub` claim Google — identitas utama setelah tersimpan (provider-agnostic, bukan `googleId`) |
| `role` | `GlobalRole?` | Nullable. Hanya untuk Global Administrator |
| `isActive` | `Boolean @default(true)` | Nonaktifkan tanpa hapus data |
| `lastLoginAt` | `DateTime?` | Waktu Auth.js mengizinkan session dibuat (bukan waktu cookie tersimpan di browser) |
| `createdAt` | `DateTime @default(now())` | |
| `updatedAt` | `DateTime @updatedAt` | Merepresentasikan perubahan APA PUN pada record — termasuk saat login hanya memperbarui `lastLoginAt`. Disengaja; field terpisah (`profileUpdatedAt`) akan ditambah jika suatu saat butuh pelacakan perubahan profil secara spesifik |

Relasi: `programAssignments ProgramAssignment[]`

## Model `ProgramAssignment`

| Field | Tipe | Catatan |
|---|---|---|
| `id` | `String @id @default(uuid())` | |
| `userId` | `String` | FK ke `User.id`, `onDelete: Restrict` (user dinonaktifkan via `isActive`, bukan dihapus) |
| `programId` | `String` | **Scalar, BUKAN relasi** — model `Program` belum ada (dibuat T2.1). FK ditambahkan T2.4 |
| `roleInProgram` | `ProgramRole` | Role operasional untuk Program spesifik ini — bisa beda per Program untuk user yang sama |
| `createdAt` / `updatedAt` | `DateTime` | |

Constraint: `@@unique([userId, programId])`, `@@index([programId])`.

Relasi: `user User @relation(fields: [userId], references: [id], onDelete: Restrict)`
