## Overview

Web aplikasi rekomendasi sepatu lari ini menggunakan Next.js App Router dengan Tailwind CSS serta integrasi awal Drizzle ORM ke Vercel Postgres. Dokumen PRD dan rencana BMAD tersedia di `docs/`.

## Struktur Penting

- `src/app` – Entry Next.js App Router + halaman hasil impor v0 (landing, analyze, result, dsb.).
- `src/components` – Kumpulan komponen shadcn/v0 (hero sections, CTA, header/footer, UI primitives).
- `src/db` – Konfigurasi Drizzle (`schema.ts`, `index.ts`).
- `src/lib` – Utilitas lintas fitur (mis. `env.ts`, `utils.ts`).
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

## Setup Supabase & Drizzle

1. Buat project di [Supabase](https://supabase.com/).
2. Dari dashboard Supabase → Project Settings → Database → Connection string (URI), salin nilai `postgresql://...` dan simpan sebagai `SUPABASE_DB_URL` di `.env.local` serta di Vercel Environment Variables.
3. Opsional: simpan `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` jika nantinya ingin memakai Supabase Client API.
4. Setelah koneksi siap, jalankan:
   ```bash
   npm run db:push
   ```
   untuk membuat tabel sesuai schema Drizzle.

## OpenAI GPT Vision

- Tambahkan `OPENAI_API_KEY` (dari dashboard OpenAI) ke `.env.local` dan Environment Variables Vercel.
- Endpoint `/api/uploads` otomatis memanggil GPT Vision untuk menganalisis footprint; pastikan akun OpenAI punya akses ke model `gpt-4o-mini`.

## Next Steps (Fase Build BMAD)

1. Implementasi modul upload jejak kaki dan form profil.
2. Integrasi GPT Vision via route/server action dengan manajemen prompt.
3. Pengembangan rule engine (`src/lib/rules.ts`) dan unit testnya.
4. Setup telemetry awal (Vercel Analytics, Sentry) dan logging custom ke tabel `events`.
5. Menyiapkan pipeline dataset jejak kaki beserta prosedur labeling SAI/CSI.
6. Sesuaikan copywriting/visual pada komponen v0 di `src/components` agar selaras dengan identitas produk.

## Import Desain v0.dev
- Desain UI diambil via `npx shadcn@latest add <v0-url>` (lihat `components.json` untuk konfigurasi).
- Struktur Tailwind sudah disesuaikan (`tailwind.config.ts`, `src/app/globals.css`); jalankan `npm run lint` setelah menambahkan komponen baru.
- Ikon/gambar mock berada di folder `public/`.

Detail lengkap mengenai deliverables tiap fase tersedia di `docs/BMAD_Method.md`.
