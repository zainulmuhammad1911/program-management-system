# Architecture Review — Simplifikasi untuk MVP
## Program Management System (PMS) — The Reform Initiatives

**Tujuan:** memastikan arsitektur di `SOFTWARE_ARCHITECTURE.md` dapat dibangun dan dirawat oleh tim 1–3 developer tanpa overhead struktural yang tidak memberi nilai nyata di tahap MVP, mengikuti prinsip KISS dan YAGNI.

---

## A. Bagian yang Sudah Tepat Ukuran (Tidak Diubah)

- Modular monolith (bukan microservices).
- Hierarki data & ERD (kompleksitas melekat pada domain bisnis, bukan pilihan arsitektur berlebihan).
- Snapshot-at-creation untuk Activity Template (keharusan fungsional, bukan over-engineering).
- Google Drive link-only strategy.
- Dashboard read-only + denormalized progress_percent.
- Permission Matrix berbasis role + assignment (dua lapis).

## B. Bagian yang Disederhanakan

### B.1 Folder Structure

**Sebelum:** monorepo `packages/domain + application + infrastructure + shared-types` terpisah.
**Sesudah:** single Next.js app, folder `modules/`/`features/` per fitur bisnis, layer sebagai konvensi ringan (bukan package terpisah dengan enforced import boundary).

**Implementasi aktual:** `features/auth/services/*.service.ts`, `lib/*` untuk wiring framework (Prisma client, Auth.js config). Konsisten dengan keputusan ini.

### B.2 Domain Events → Pemanggilan Fungsi Langsung

**Sebelum:** `ChecklistItemCompleted` event → banyak handler terdaftar (Progress, Audit, Notification).
**Sesudah:** satu fungsi orchestrator, pemanggilan berurutan dalam satu transaksi — tanpa event bus.

### B.3 Bounded Context & Aggregate Root Formal → Pembagian Modul Konseptual

Hapus formalitas DDD strategis; query boleh join langsung lintas modul bila paling sederhana.

### B.4 Value Objects Formal → Tipe Primitif + Schema Validation

Gunakan Zod di boundary (Server Action), bukan class Value Object berlapis.

### B.5 Error Handling → Satu `AppError` Generik

Bukan class error kustom per kasus dengan pemetaan 3 lapis.

### B.6 Audit Log & Notification → Fungsi Langsung, Bukan Service Formal

`writeAuditLog()` sebagai fungsi utilitas; Notification tidak dibangun sama sekali di MVP (indikator visual dihitung langsung dari due_date saat query).

### B.7 Server Action Strategy → Orchestrator Boleh Multi-Step

Server Action boleh berisi beberapa pemanggilan fungsi service berurutan dalam satu transaksi, selama tetap mudah dibaca linear.

## C. Ringkasan Perubahan (Before → After)

| Aspek | Sebelumnya | Setelah Simplifikasi |
|---|---|---|
| Struktur kode | 4 package terpisah | 1 app, folder `features/*` per fitur |
| Alur eksekusi aksi | Domain event → handler | Fungsi orchestrator langsung |
| DDD formalitas | Bounded Context + Aggregate ketat | Pembagian modul konseptual saja |
| Tipe data | Value Object (class) | Tipe primitif + Zod di boundary |
| Error handling | Class error kustom berlapis | Satu `AppError` generik |
| Audit Log | Service + interface | Fungsi `writeAuditLog()` langsung |
| Notification | Service + interface sejak MVP | Tidak dibangun sama sekali di MVP |

## D. Prinsip Panduan Keputusan Arsitektur Selanjutnya

1. Apakah ada ≥2 implementasi nyata yang butuh diseragamkan lewat abstraksi? Jika hanya 1, tunda abstraksinya.
2. Apakah proses ini benar-benar asynchronous? Jika tidak, jangan pakai pola event-driven.
3. Bisakah developer baru memahami alur dengan membaca satu file dari atas ke bawah?
4. Apakah kompleksitas ini melekat pada domain bisnis (given) atau pilihan teknis (dapat disederhanakan)?

---

**Catatan implementasi (per T1.4):** prinsip-prinsip di atas telah dipegang konsisten sepanjang T0.1–T1.4 — misalnya keputusan menunda `AppError`/wrapper otorisasi di T1.4 (lihat catatan "Future Extension" pada desain T1.4), dan keputusan tidak memakai `@auth/prisma-adapter` penuh di T0.3/T1.2.
