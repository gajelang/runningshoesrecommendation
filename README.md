## Overview

Web aplikasi rekomendasi sepatu lari ini menggunakan Next.js App Router dengan Tailwind CSS serta integrasi awal Drizzle ORM ke Vercel Postgres. Dokumen PRD dan rencana BMAD tersedia di `docs/`.

## Struktur Penting

- `src/app` – Entry Next.js App Router.
- `src/db` – Konfigurasi Drizzle (`schema.ts`, `index.ts`).
- `src/lib` – Utilitas lintas fitur (mis. `env.ts`).
- `docs/` – PRD dan dokumen metodologi BMAD.
- `drizzle.config.ts` – Konfigurasi CLI Drizzle.
- `.env.example` – Variabel lingkungan yang diperlukan.

## Menjalankan Lokally

1. Salin `.env.example` menjadi `.env.local` dan isi kredensial Vercel Postgres (`POSTGRES_URL`, dll) serta `OPENAI_API_KEY`.
2. Instal dependensi (sekali saja): `npm install`.
3. Jalankan development server: `npm run dev`.
4. Buka `http://localhost:3000`.

## Perintah Tersedia

- `npm run dev` – Development server (Webpack).
- `npm run build` – Build production.
- `npm run lint` – Menjalankan ESLint.
- `npm run db:generate` – Menghasilkan migrasi dari schema Drizzle.
- `npm run db:push` – Mensinkronkan schema ke database.
- `npm run db:studio` – Membuka antarmuka Drizzle Studio.

## Setup Database & Drizzle

- Kredensial DB dibaca dari `POSTGRES_URL`. Untuk operasi non-pooling (CLI, migrasi), gunakan `POSTGRES_URL_NON_POOLING`.
- Jalankan `npm run db:generate` setelah memperbarui `src/db/schema.ts` untuk menghasilkan migrasi.
- Gunakan `npm run db:push` untuk menerapkan schema ke Vercel Postgres.

## Next Steps (Fase Build BMAD)

1. Implementasi modul upload jejak kaki dan form profil.
2. Integrasi GPT Vision via route/server action dengan manajemen prompt.
3. Pengembangan rule engine (`src/lib/rules.ts`) dan unit testnya.
4. Setup telemetry awal (Vercel Analytics, Sentry) dan logging custom ke tabel `events`.
5. Menyiapkan pipeline dataset jejak kaki beserta prosedur labeling SAI/CSI.

Detail lengkap mengenai deliverables tiap fase tersedia di `docs/BMAD_Method.md`.
