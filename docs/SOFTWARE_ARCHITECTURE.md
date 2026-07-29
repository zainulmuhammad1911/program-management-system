# Software Architecture Document
## Program Management System (PMS) — The Reform Initiatives

**Basis:** PRD v1.0
**Catatan:** Dokumen ini adalah rancangan arsitektur awal. Lihat `ARCHITECTURE_REVIEW.md` untuk revisi simplifikasi (KISS/YAGNI) yang menggantikan sebagian pola di sini (DDD berlapis, domain events, package terpisah).

---

## 1. High Level Architecture

Modular monolith (bukan microservices) — Next.js App Router + Server Actions sebagai application server, PostgreSQL sebagai primary datastore, Google OAuth sebagai SSO. Google Drive hanya sebagai link store (tidak ada integrasi API di MVP).

## 2. Modul Aplikasi

Identity & Access, Workspace Management, Program Management, Output Management, Activity Management, Activity Template, Checklist & Progress Engine, RTL, Report, Document Registry, Dashboard & Analytics, Audit Log, Notification (Fase 2), Search.

## 3. Folder Structure (Awal — direvisi di Architecture Review)

Rancangan awal memakai `packages/domain`, `packages/application`, `packages/infrastructure` terpisah (DDD berlapis). **Ini telah disederhanakan** di Architecture Review menjadi struktur feature-based (`app/`, `features/*`, `lib/`, `components/`) — lihat `ARCHITECTURE_REVIEW.md` §B.1.

## 4. Routing Structure

Route utama: `/login`, `/my-tasks`, `/search`, `/workspace/:id`, `/program/:id`, `/program/:id/output/:id/activity/:id`, `/program/:id/report`, `/admin/activity-templates`, `/admin/users`.

## 5. Database Architecture

PostgreSQL, hybrid relational + JSONB (Activity Template stage definition sebagai JSONB, di-snapshot jadi baris relasional saat Activity dibuat). Progress didenormalisasi (`progress_percent` disimpan, di-recompute saat checklist berubah) demi kecepatan baca dashboard.

## 6. Domain Driven Design (Awal — diringankan di Architecture Review)

Rancangan awal memakai Bounded Context formal, Aggregate Root ketat, dan Domain Events (`ChecklistItemCompleted`, dst.) dengan event handler terpisah. **Architecture Review menyederhanakan ini** menjadi pemanggilan fungsi langsung berurutan dalam satu orchestrator (bukan event-driven) — lihat `ARCHITECTURE_REVIEW.md` §B.2, §B.3.

## 7. Entity Relationship Diagram (Ringkasan)

```
Workspace 1—N Program 1—N Output 1—N Activity
ActivityTemplate 1—N Activity (instantiated by)
Activity 1—N ActivityStage 1—N ChecklistItem
Activity 1—N RTL (opsional referensi ke ChecklistItem)
Program 1—N Report (opsional referensi ke Output/Activity)
Program/Output/Activity 1—N Document (polymorphic parent)
User N—N Program (via ProgramAssignment)
```

Entitas yang **sudah diimplementasikan** (lihat `prisma/schema.prisma`): `User`, `ProgramAssignment`. Entitas lain (Workspace, Program, Output, Activity, ActivityTemplate, ChecklistItem, RTL, Report, Document) masih dalam roadmap Sprint 2+.

## 8. Sequence Diagram (Konsep Awal)

Lihat dokumen asli untuk sequence "Membuat Activity dari Template", "Menandai Checklist Selesai", "Submit Report ke Donor" — seluruhnya masih rencana (Sprint 2+), belum diimplementasikan.

## 9. Permission Matrix

| Aksi | Admin | Program Manager | Program Officer |
|---|:---:|:---:|:---:|
| Kelola Workspace & setting global | ✅ | ❌ | ❌ |
| CRUD Program | ✅ | ✅ (assigned) | ❌ |
| CRUD Output/Activity | ✅ | ✅ (assigned) | ✅ (assigned) |
| Centang/ubah Checklist | ✅ | ✅ | ✅ |
| CRUD RTL | ✅ | ✅ | ✅ |
| CRUD Report | ✅ | ✅ | ✅ (assigned) |
| Lihat Dashboard Workspace | ✅ | ✅ | ❌ |
| Lihat Audit Log | ✅ | ✅ (scope assigned) | ❌ |

**Catatan pasca-Architecture Review:** implementasi aktual role sudah disederhanakan — `GlobalRole` hanya berisi `ADMIN`; peran Program Manager/Program Officer sepenuhnya berasal dari `ProgramAssignment.roleInProgram` (`ProgramRole`), bukan role global. Lihat `ARCHITECTURE_REVIEW.md` dan riwayat keputusan T1.1.

## 10. API Design

Server Actions untuk seluruh mutasi UI internal; REST API routes (`/api/*`) terbatas untuk kebutuhan eksternal (dashboard data, search, auth callback).

## 11. Server Action Strategy

Server Action = orchestrator: validasi otorisasi → panggil service function → transactional write → revalidate cache tertarget.

## 12. State Management Strategy

React Server Components sebagai default untuk server state; `useOptimistic` untuk toggle checklist; tidak ada state management library global (Redux/Zustand).

## 13. Error Handling Strategy

Satu `AppError` generik (`code` + `message`), bukan class error kustom berlapis (disederhanakan di Architecture Review). Belum diimplementasikan di kode (masih rencana, akan diperkenalkan saat dibutuhkan nyata).

## 14. Audit Log Strategy

Tabel append-only `audit_log`, ditulis dalam transaksi yang sama dengan perubahan data utama. Belum diimplementasikan di kode (Sprint 6 pada Implementation Plan).

## 15. Notification Strategy

MVP: in-app visual only (badge overdue). Fase 2: email via scheduled job. Belum diimplementasikan.

## 16. Progress Calculation Strategy

Formula berjenjang: ChecklistItem (status) → ActivityStage (rata-rata, exclude N/A) → Activity (rata-rata stage) → Output (rata-rata Activity non-cancelled) → Program (rata-rata Output). Precompute-and-store, bukan hitung on-the-fly. Belum diimplementasikan (Sprint 2/3).

## 17. Google Drive Integration Strategy

MVP: link-only, validasi format URL saja, tanpa panggilan API. Fase 4: integrasi Drive API untuk validasi keberadaan file.

## 18. Dashboard Data Flow

Write path memicu recompute progress + cache invalidation tertarget; read path membaca `progress_percent` yang sudah precomputed, tidak pernah menghitung ulang saat load.

## 19. Future Scalability

Async job queue untuk progress recompute jika volume besar, read replica untuk dashboard, multi-tenancy hardening jika di-white-label, migrasi search ke Elasticsearch jika volume besar, approval workflow diaktifkan tanpa migrasi skema besar (field sudah disiapkan).

## 20. Risiko Arsitektur & Mitigasi

Lihat tabel lengkap di riwayat percakapan — mencakup risiko cascade recompute lambat, broken Drive links, polymorphic Document association, ambiguitas snapshot vs template, ketergantungan Google OAuth, over-engineering DDD, audit log tumbuh besar, single point of failure PostgreSQL.

---

**Status implementasi terhadap dokumen ini (per T1.4):** Fase 0 (setup, auth, CI) dan sebagian Sprint 1 (User, ProgramAssignment, create-on-first-login, middleware, authorization helper) sudah selesai — lihat `IMPLEMENTATION_PLAN.md` untuk status per task.
