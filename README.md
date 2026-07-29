# Program Management System (PMS)

[![CI](https://github.com/zainulmuhammad1911/program-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/zainulmuhammad1911/program-management-system/actions/workflows/ci.yml)

Aplikasi manajemen program untuk The Reform Initiatives (TRI).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- ESLint + Prettier

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Script Tersedia

- `npm run dev` — jalankan development server
- `npm run build` — build production
- `npm run lint` — cek lint
- `npm run format` — format kode dengan Prettier
- `npm run format:check` — cek format tanpa menulis perubahan

## Struktur Folder

```
app/          Routing (Next.js App Router)
features/     Kode per fitur bisnis (kerangka, diisi bertahap)
lib/          Utilitas & konfigurasi bersama
components/   Komponen UI bersama
```
