# Frontend Product Requirements – Running Shoes Recommendation Platform

Dokumen ini merinci kebutuhan produk khusus untuk sisi frontend aplikasi web rekomendasi sepatu lari. Semua implementasi direncanakan menggunakan Next.js (App Router), TypeScript, dan Tailwind CSS.

## 1. Sasaran Frontend
- Menyediakan alur pengguna yang sederhana dan informatif untuk mengunggah jejak kaki, memasukkan profil, dan menerima rekomendasi.
- Menjaga konsistensi visual sesuai identitas brand penelitian (warna netral olahraga, tipografi modern).
- Menyajikan hasil analisis AI dengan rasionalisasi yang jelas dan dapat dibagikan.
- Memfasilitasi admin internal untuk memantau status analisis dan mengelola katalog sepatu (roadmap).

## 2. Struktur Informasi & Navigasi
| Halaman | URL | Peran |
| :-- | :-- | :-- |
| Landing | `/` | Penjelasan manfaat, CTA ke analisis, testimoni/pengantar ilmiah. |
| Panduan Foto | `/guide` | Tutorial langkah demi langkah cara mengambil foto jejak kaki, contoh baik/buruk. |
| Analisis | `/analyze` | Form multi-step (profil → unggah foto → konfirmasi); men-triger proses GPT Vision. |
| Hasil Analisis | `/result/[scanId]` | Menampilkan ringkasan arch/pronasi, rekomendasi sepatu, tips tindak lanjut. |
| Histori | `/history` (guarded) | Daftar analisis sebelumnya milik pengguna. |
| Admin Dashboard (Future) | `/admin` | Monitoring KPI, CRUD katalog sepatu, approval manual. |
| Informasi & Kebijakan | `/privacy`, `/terms`, `/faq` | Kebutuhan compliance dan edukasi pengguna. |

Navigasi utama: logo (home), menu `Panduan`, `Analisis`. Secondary nav di footer untuk FAQ, Privacy, Terms. Auth gating opsional (NextAuth) untuk halaman histori/admin.

## 3. Fitur & Komponen Prioritas
### 3.1 Onboarding & Landing
- Hero section dengan CTA `Mulai Analisis`.
- Ringkasan proses 3 langkah (Profil → Jejak → Rekomendasi).
- Testimoni atau data ilmiah singkat.
- FAQ preview dengan link ke halaman detail.

### 3.2 Form Profil Pelari (Page `/analyze`)
- Stepper progress (3 langkah).
- Input data: nama optional, email (untuk kirim hasil), berat badan, tujuan latihan (dropdown), preferensi cushioning (slider/radio), riwayat cedera (checkbox).
- Validasi real-time (React Hook Form + Zod opsional).
- State global minimal (Zustand/Context) untuk menyimpan data antar step.

### 3.3 Upload Jejak Kaki
- Komponen dropzone drag & drop + fallback tombol pilih file.
- Panduan singkat + link ke `/guide`.
- Preview gambar dengan opsi crop/rotate sederhana.
- Validasi resolusi, ukuran, dan orientasi.
- Progress upload (jika streaming ke storage).

### 3.4 Konfirmasi & Submit
- Ringkasan data profil + foto sebelum submit.
- Checkbox persetujuan privacy & penggunaan data.
- Tombol `Proses Analisis` memanggil server action/API.
- Menampilkan indikator loading (skeleton, spinner) sampai hasil siap.

### 3.5 Halaman Hasil (`/result/[scanId]`)
- Header dengan status (Sukses/Gagal) dan waktu proses.
- Heatmap/overlay (opsional) atau visual highlight arch/pronasi (SVG/static).
- Kartu ringkasan:
  - Tipe arch + penjelasan singkat.
  - Tipe pronasi + tips.
  - Confidence score (progress bar).
- Section rekomendasi sepatu (2–3 item):
  - Nama model, brand, kategori (Stability/Neutral/Motion Control).
  - Poin fitur penting (medial post, cushioning, drop).
  - Tombol `Lihat Detail`, `Simpan`, `Kunjungi Toko` (jika tersedia).
- Panel rasionalisasi teks (hasil GPT + rule engine).
- CTA lanjutan: `Unduh PDF`, `Bagikan link`, `Analisis ulang`, `Lihat Histori`.

### 3.6 Histori Pengguna
- Tabel/card list analisis masa lalu (tanggal, arch, pronasi, link ke hasil).
- Filter sederhana (rentang waktu, kategori sepatu).
- Opsional: status (menunggu, sukses, butuh review manual).

### 3.7 Admin Dashboard (Roadmap)
- Statistik ringkas (jumlah analisis, konversi, latensi rata-rata).
- Tabel katalog sepatu dengan fitur CRUD.
- Daftar rekomendasi manual review (jika AI gagal).

### 3.8 Global Components
- Layout utama dengan header responsive, menu mobile (drawer), dan footer informatif.
- Card, Button, Input, Select, Badge, Modal (bisa memanfaatkan Headless UI / Radix UI).
- Alert/Toast untuk feedback (error upload, sukses simpan).
- Skeleton/loading state untuk area konten utama.

## 4. Integrasi & State Management
- Gunakan Server Actions/APIs untuk komunikasi backend.
- State client:
  - Form multi-step (React Hook Form).
  - Global store untuk user session, histori, upload progress (Zustand).
- Auth (opsional):
  - NextAuth dengan email atau OAuth; protected routes (histori/admin).
- Penyimpanan data:
  - Akses data melalui hooks custom (`useFootScan(scanId)`, `useRecommendations(scanId)`).
- Error boundary khusus untuk halaman hasil (menangani kegagalan API).

## 5. Desain & Branding
- Palette warna: base putih, aksen biru/turquoise (energi), warna peringatan oranye/merah untuk pronasi ekstrem.
- Tipografi: font sans modern (mis. Inter/Geist).
- Ilustrasi / ikon: gunakan ilustrasi anatomi kaki sederhana.
- Responsif: mobile-first, breakpoint utama ≤640px, 768px, ≥1024px.
- Aksesibilitas: label ARIA untuk input, kontrast minimal 4.5:1, keyboard navigable.

## 6. Analytics & Logging
- Event yang harus dicatat (frontend + server log):
  - `guide_viewed`, `profile_submitted`, `image_uploaded`, `analysis_started`, `analysis_completed`, `recommendation_clicked`, `download_pdf`, `share_link`.
- Integrasi awal: Vercel Analytics + custom event endpoint.
- Gunakan tabel `events` di backend untuk konsistensi (frontend mengirim JSON).

## 7. Dependensi Frontend
- Next.js (App Router), TypeScript, Tailwind.
- React Hook Form + Zod (validasi form).
- Zustand (state global), SWR/React Query (fetch data).
- Headless UI / Radix (opsional) untuk komponen interaktif.
- Tailwind plugin form/typography jika dibutuhkan.

## 8. Roadmap Iterasi Frontend
| Sprint | Fokus | Deliverables |
| :-- | :-- | :-- |
| Sprint 1 | Landing + Panduan | Halaman `/`, `/guide`, komponen navigasi, basic branding. |
| Sprint 2 | Form Profil & Upload | Stepper form, validasi, upload UI (tanpa backend). |
| Sprint 3 | Integrasi Analisis & Hasil | Hub server action, tampilan hasil, loading/error state. |
| Sprint 4 | Histori & Sharing | Halaman `/history`, fitur unduh/bagikan, toasts. |
| Sprint 5 | Admin & Optimisasi | Dashboard awal, refinemen UI, aksesibilitas, performance audit. |

## 9. QA Checklist Frontend
- Form dapat dilalui tanpa bug di mobile/desktop.
- Upload menolak file invalid dan menampilkan pesan jelas.
- Loading/empty/error states tertangani tiap halaman.
- Hasil rekomendasi menampilkan data sesuai format backend.
- Responsivitas diuji pada viewports 360px, 768px, 1024px, 1440px.
- Lighthouse score minimal 85 untuk Performance & Accessibility.

## 10. Lampiran
- Wireframe/wishlist visual (referensi Figma, link eksternal).
- Contoh copywriting (CTA, dialog error).
- Daftar ikon/ilustrasi yang diperlukan.
- Template analytics event payload.

