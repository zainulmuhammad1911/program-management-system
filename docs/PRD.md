# Product Requirement Document
## Program Management System (PMS) — The Reform Initiatives

**Versi:** 1.0 Draft
**Status:** Disetujui sebagai dasar Software Architecture & Implementation Plan

---

## 1. Latar Belakang & Masalah

The Reform Initiatives (TRI) mengelola banyak program yang didanai oleh berbagai donor, masing-masing dengan siklus perencanaan, pelaksanaan, dan pelaporan sendiri. Saat ini, Program Officer (PO) kemungkinan mengandalkan spreadsheet, dokumen terpisah, dan komunikasi manual untuk:

- Melacak status pelaksanaan kegiatan (activity) dari banyak program sekaligus
- Memastikan tahapan kerja (persiapan, pelaksanaan, pelaporan) diikuti secara konsisten per jenis kegiatan
- Mengelola tindak lanjut (follow-up) dari hasil kegiatan, rapat, atau temuan monev
- Melacak kewajiban pelaporan ke donor beserta tenggat waktunya

**Masalah inti:** tidak ada satu sumber kebenaran (single source of truth) tentang *progress program yang nyata* — progress yang dilaporkan sering berbasis persepsi/self-report, bukan berdasarkan penyelesaian pekerjaan aktual yang dapat diverifikasi.

**Tujuan PMS:** menyediakan sistem manajemen kerja terstruktur, di mana progress adalah **hasil**, bukan **input** — dihitung otomatis dari penyelesaian checklist yang mengalir dari template kerja standar (Activity Template).

---

## 2. Target Pengguna

| Peran | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Program Officer (PO)** | Pengguna utama, mengelola 1+ program sehari-hari | Input cepat, checklist jelas, tidak perlu klik berlapis-lapis |
| **Program Manager (PM)** | Mengawasi beberapa Program dalam satu Workspace | Overview lintas program, tracking deadline laporan, verifikasi (jika mode verifikasi aktif) |
| **Admin/Ops (TRI Internal)** | Mengelola Workspace, user, konfigurasi Activity Template | Setup organisasi, kontrol akses, definisi template |
| **Direktur/Leadership** | Melihat status makro seluruh organisasi | Dashboard read-only, ringkasan status program & pelaporan donor |
| **Donor/Mitra (opsional, fase lanjut)** | Pemangku kepentingan eksternal | Akses terbatas read-only ke status laporan program tertentu |

**MVP** fokus pada Program Officer dan Program Manager. Direktur dan Donor adalah perluasan pasca-MVP.

---

## 3. Hierarki Data & Konsep Kunci

```
Workspace
 └─ Program (donor, periode, budget summary)
     └─ Output (hasil/outcome yang ingin dicapai)
         └─ Activity / Kegiatan (instance kerja nyata: Workshop, FGD, Training, Research, dst.)
             ├─ Activity Workflow (stages, dibentuk otomatis dari Activity Template saat Activity dibuat)
             │   └─ Checklist (per stage, item kerja yang harus diselesaikan)
             ├─ RTL (follow-up task, opsional, terkait ke Activity, bisa referensi ke Checklist tertentu)
             └─ Dokumen (tautan Google Drive, dokumen pendukung: TOR, notulensi, materi, dll.)
     └─ Report (deliverable resmi ke donor — entitas Program-level)
```

**Activity Template** — template reusable per jenis kegiatan (Workshop, FGD, Research, Training, Policy Dialogue, dst.), berisi definisi stages dan checklist item default di tiap stage. Saat Activity baru dibuat, sistem meng-generate struktur stages+checklist secara snapshot (bukan referensi live ke template).

**RTL (Rencana Tindak Lanjut)** — modul follow-up task independen, terkait wajib ke satu Activity, opsional mereferensikan Checklist/stage asal. Bukan bagian struktural wajib dari checklist.

**Report** — entitas Program-level terpisah dari Dokumen, dengan lifecycle sendiri (Draft/Internal Review/Submitted/Accepted/Revision Requested).

**Dokumen** — repositori tautan Google Drive murni, tanpa file upload, tanpa lifecycle status.

**Progress** — dihitung otomatis dari penyelesaian checklist, berjenjang: Checklist → Stage → Activity → Output → Program. Tidak pernah diinput manual.

**Dashboard** — murni read-only, tidak ada input data.

---

## 4. Ringkasan Kritik & Penyempurnaan Konsep

1. Workflow → **Activity Template**, reusable, generate stages+checklist otomatis saat Activity dibuat.
2. RTL → modul follow-up **independen**, terkait ke Activity (bukan wajib per checklist).
3. Approval → **configurable per Program/Workspace** (Simple/Verification/Multi-level), default OFF di MVP tapi arsitektur data siap menampung status verifikasi sejak awal.
4. Report → entitas terpisah dari Dokumen, dengan lifecycle & due date sendiri.

Guardrail desain: kedalaman navigasi (breadcrumb + "My Tasks" + global search wajib sejak MVP), aturan agregasi progress harus eksplisit, multi-PO per Program diasumsikan many-to-many.

---

## 5. User Stories

### Program Officer
- Membuat Activity baru dari Activity Template tertentu, stages & checklist otomatis terbentuk.
- Mencentang checklist item, progress Activity ter-update otomatis.
- Melihat "My Tasks" — gabungan checklist & RTL miliknya lintas semua Program.
- Membuat RTL kapan saja selama siklus Activity berlangsung.
- Menambahkan tautan Google Drive sebagai Dokumen pendukung.
- Melihat daftar Report yang akan jatuh tempo untuk Program-nya.

### Program Manager
- Melihat dashboard ringkasan progress seluruh Program yang diawasi.
- (Jika mode verifikasi aktif) memverifikasi checklist yang ditandai selesai oleh PO.
- Melihat RTL yang overdue di seluruh Program-nya.
- Melihat status semua Report termasuk yang revision requested.

### Admin
- Membuat dan mengelola Activity Template.
- Mengatur mode approval (Simple/Verification/Multi-level).
- Mengelola user dan hak akses.

### Direktur (pasca-MVP)
- Melihat ringkasan status seluruh Workspace dalam satu tampilan.

---

## 6. Functional Requirements

- **FR-1** Manajemen Hierarki (Workspace, Program, Output, Activity — CRUD, breadcrumb, atribut dasar).
- **FR-2** Activity Template — CRUD, stages+checklist default, snapshot saat instantiation, versioning sederhana.
- **FR-3** Checklist & Progress Engine — status item, formula agregasi berjenjang, audit trail perubahan, read-only computed.
- **FR-4** RTL — CRUD, due date, priority, status, referensi opsional ke checklist.
- **FR-5** Report — entitas Program-level, lifecycle status, referensi opsional ke Output/Activity.
- **FR-6** Dokumen — tautan Google Drive saja, metadata dasar, validasi format URL.
- **FR-7** Dashboard — read-only, ringkasan Workspace/Program, "My Tasks".
- **FR-8** Navigasi & Aksesibilitas — breadcrumb persisten, global search, filter/sorting.
- **FR-9** Manajemen User & Akses — role (Admin/PM/PO), akses berbasis assignment, many-to-many Program↔PO.
- **FR-10** Konfigurasi Approval — `approval_mode` per Program/Workspace, hanya mode Simple aktif fungsional di MVP.

---

## 7. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performance | Dashboard <2 detik untuk ~50 Program aktif |
| Scalability | Ratusan Activity per Program tanpa degradasi query progress |
| Auditability | Semua perubahan status checklist/RTL/Report tercatat dengan timestamp & user |
| Data Integrity | Perubahan Activity Template tidak mempengaruhi Activity yang sudah berjalan (snapshot) |
| Availability | Target uptime 99% |
| Security | SSO Google, role-based access control |
| Usability | Aksi harian PO maksimal 3 klik dari halaman utama |
| Privacy | Tidak menyimpan file donor langsung (link-only) |
| Maintainability | Skema Activity Template fleksibel tanpa perubahan skema DB per jenis kegiatan baru |
| Compatibility | Tautan Dokumen kompatibel format Google Drive/Docs/Sheets/Slides |

---

## 8. Ruang Lingkup MVP

**Termasuk:** hierarki penuh, Activity Template + progress engine otomatis, RTL independen, Report dengan lifecycle dasar, Dokumen (link), Dashboard read-only, role dasar (Admin/PM/PO), global search & breadcrumb, audit log dasar.

**Tidak termasuk (pasca-MVP):** approval berjenjang aktif, role Direktur/Donor eksternal, notifikasi email/push, integrasi Google Drive API, analitik lanjutan, mobile app native, financial tracking mendalam, versioning penuh Activity Template.

---

## 9. Roadmap Pengembangan

- **Fase 1 — MVP (Bulan 1–3):** hierarki inti, Activity Template & progress engine, RTL dasar, Dokumen, Dashboard read-only, role dasar.
- **Fase 2 — Governance & Reporting (Bulan 4–5):** mode Verification, notifikasi email, eksport laporan.
- **Fase 3 — Kolaborasi & Insight (Bulan 6–8):** mode Multi-level approval, role Direktur, analitik tren, komentar/diskusi.
- **Fase 4 — Ekosistem Eksternal (Bulan 9+):** akses Donor, integrasi Google Drive API, mobile-responsive lanjutan, integrasi kalender.

---

## 10. Keputusan Final (Hasil Klarifikasi)

- Skala: puluhan Program/user (TRI), bukan ribuan — arsitektur ringan cukup.
- Autentikasi: Google Workspace SSO.
- Output indikator: deskriptif di MVP, target kuantitatif terstruktur ditunda.
- Bobot progress: equal-weight per default, opsi weighting ditunda ke fase lanjut.
- Stack: Next.js + PostgreSQL + Prisma (lihat Software Architecture).
