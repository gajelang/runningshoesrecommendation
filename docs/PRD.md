# Product Requirements Document (PRD)

## 1. Ringkasan Eksekutif
Sistem rekomendasi sepatu lari berbasis web ini memanfaatkan analisis jejak kaki 2D dan data profil pelari untuk memberikan rekomendasi sepatu yang akurat, dapat dijelaskan, dan mudah diakses. Produk dikembangkan sebagai bagian dari penelitian skripsi yang memadukan model AI multimodal (GPT Vision) dengan mesin rekomendasi berbasis aturan.

## 2. Tujuan Produk
| ID | Tujuan | Indikator Kesuksesan |
| :-- | :-- | :-- |
| G1 | Mempermudah pelari menentukan kategori sepatu yang tepat tanpa akses laboratorium biomekanik. | ≥80% pengguna menyelesaikan proses analisis dalam satu sesi. |
| G2 | Menyediakan hasil analisis arch/pronasi yang akurat dan konsisten. | AUC klasifikasi arch ≥0.88 terhadap label ahli. |
| G3 | Menyampaikan rekomendasi yang dapat dijelaskan dan dipercaya. | ≥70% rekomendasi dinilai “relevan” oleh responden uji lapangan. |
| G4 | Mengurangi tingkat pengembalian (return rate) akibat ketidakcocokan sepatu. | Return rate pengguna pilot turun ≥15% dibanding baseline. |

## 3. Ruang Lingkup Produk
- Platform web Next.js yang dapat diakses di desktop dan mobile.
- Modul upload foto jejak kaki (wet footprint) dan pengambilan data profil pelari.
- Integrasi GPT Vision API untuk klasifikasi arch dan pronasi.
- Rule engine yang memetakan hasil analisis ke kategori sepatu dan model spesifik.
- Dashboard internal untuk meninjau hasil dan mengelola katalog sepatu.
- Fitur edukasi singkat tentang tipe kaki dan perawatan sepatu.

## 4. Persona & Kebutuhan
| Persona | Deskripsi | Kebutuhan Utama | Pain Points |
| :-- | :-- | :-- | :-- |
| Pelari Rekreasional | Pria/wanita, 20-40 tahun, latihan 2-4 kali/minggu, belanja sepatu daring. | Panduan cepat memilih sepatu sesuai bentuk kaki; bahasa mudah dipahami. | Sulit menilai pronasi sendiri; takut salah beli. |
| Pelari Kompetitif | Atlet komunitas, mengincar performa, update sepatu tiap 6-9 bulan. | Rekomendasi sesuai gaya lari/target latihan; akses histori analisis. | Data teknis tidak terstruktur; rekomendasi umum. |
| Admin Produk | Peneliti/owner platform. | Memantau kualitas rekomendasi, menambah katalog sepatu. | Butuh insight analitik dan kontrol konten. |

## 5. Journey Pengguna
1. **Onboarding**: Pengguna membaca panduan foto jejak kaki dan menyetujui consent.
2. **Input Data**: Unggah foto jejak kaki, isi berat badan, tujuan latihan, preferensi cushioning, riwayat cedera.
3. **Analisis AI**: Server mengirim gambar ke GPT Vision, mendapatkan klasifikasi arch/pronasi + confidence.
4. **Rule Engine**: Sistem menggabungkan output AI dengan profil untuk menghasilkan rekomendasi kategori dan 2-3 model sepatu.
5. **Presentasi Hasil**: Pengguna melihat ringkasan visual (heatmap/overlay), rasionalisasi, tips latihan, opsi simpan/unduh/berbagi.
6. **Tindak Lanjut**: Pengguna dapat menambahkan rekomendasi ke shortlist, set pengingat, atau mengajukan pertanyaan manual.

## 6. Fitur Utama
| ID | Fitur | Deskripsi | Prioritas | Ketergantungan |
| :-- | :-- | :-- | :-- | :-- |
| F1 | Panduan Foto | Halaman tutorial interaktif (contoh foto baik/buruk, checklist). | Must-have | None |
| F2 | Form Profil Pelari | Form multi-step: detail pribadi, tujuan latihan, rekomendasi cushioning. | Must-have | F1 |
| F3 | Upload & Pre-processing | Validasi format, cropping otomatis, enkripsi penyimpanan sementara. | Must-have | F1 |
| F4 | Integrasi GPT Vision | Permintaan API dengan prompt terstruktur, penanganan error/timeout. | Must-have | F3 |
| F5 | Rule Engine | JSON rules + skor prioritas untuk kategori sepatu dan fitur tambahan. | Must-have | F4 |
| F6 | Hasil & Rasionalisasi | Tampilan hasil analisis, rekomendasi model sepatu, CTA lanjutan. | Must-have | F5 |
| F7 | Histori Analisis | Pengguna melihat hasil sebelumnya, membandingkan trend. | Should-have | F6, Auth |
| F8 | Admin Dashboard | CRUD katalog sepatu, monitoring KPI, audit log rekomendasi. | Should-have | Auth, Database |
| F9 | Integrasi Marketplace | Tautan afiliasi/checkout ke e-commerce pilihan. | Could-have | F6, Legal |

## 7. Persyaratan Teknis
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, Zustand/Redux Toolkit untuk state.
- **Backend**: Next.js API Routes/Server Actions; integrasi GPT Vision via OpenAI SDK; rule engine berbasis TypeScript; Vercel Edge/Node runtimes.
- **Database**: Postgres (Supabase/PlanetScale adaptor) dengan tabel `users`, `foot_scans`, `recommendations`, `shoe_catalog`, `events`.
- **Storage**: Vercel Blob/Supabase Storage untuk gambar dengan enkripsi at-rest.
- **Auth**: NextAuth (Email/OAuth) + optional magic link.
- **CI/CD**: Vercel deployments, lint/test pipeline (ESLint, Jest, Playwright).
- **Observabilitas**: Vercel Analytics, Sentry, log khusus untuk panggilan GPT.

## 8. Persyaratan Non-Fungsional
| Kategori | Target |
| :-- | :-- |
| Kinerja | Waktu total unggah → hasil ≤3 detik untuk foto <2MB. |
| Keamanan | Enkripsi data sensitif (gambar, profil); akses admin role-based. |
| Privasi | Consent eksplisit, kebijakan retensi 30 hari (dapat diperpanjang bila diizinkan). |
| Ketersediaan | SLA target 99%, fallback pesan bila layanan AI gagal. |
| Skalabilitas | Tahan 100 permintaan/jam (pilot) dengan rute prioritas dan queue. |
| Aksesibilitas | Standar WCAG 2.1 AA untuk UI (kontras, alt text, keyboard navigation). |

## 9. Data & Labeling
- **Dataset Internal**: Koleksi jejak kaki basah yang telah diukur SAI/CSI oleh ahli.
- **Proses Labeling**: Dua ahli biomekanik menilai; gunakan consensus atau adjudication.
- **Augmentasi**: Rotasi kecil, perubahan pencahayaan untuk robust terhadap variasi foto.
- **Governance**: Catatan provenance, perjanjian penggunaan data, prosedur penghapusan permanen.
- **Monitoring**: Hitung drift dengan sampel bulanan; audit bias (gender, ukuran kaki).

## 10. Metrik Kesuksesan
- **Model**: AUC klasifikasi arch ≥0.88; F1 pronasi ≥0.85; confidence median ≥0.75.
- **Produk**: Completion rate ≥80%; waktu proses median <3 detik; NPS ≥30.
- **Bisnis**: Return rate turun ≥15%; ≥50% pengguna simpan rekomendasi; 10% klik ke tautan pembelian.

## 11. Roadmap Tingkat Tinggi
| Fase | Durasi | Keluaran |
| :-- | :-- | :-- |
| Penelitian & Data (M1) | 4 minggu | Dataset final, prototipe prompt GPT Vision, definisi rules awal. |
| Build MVP (M2) | 6 minggu | Frontend dasar, integrasi API, rule engine v1, logging inti. |
| Measure & Iterate (M3) | 4 minggu | Uji lapangan 30 pelari, dashboard analitik, perbaikan rules. |
| Beta Publik (M4) | 4 minggu | Fitur histori, admin dashboard, integrasi marketplace awal. |
| Deploy & Scale (M5) | 4 minggu | Optimisasi performa, security hardening, dokumentasi rilis penuh. |

## 12. Risiko & Mitigasi
- **Variasi Kualitas Foto** → Sediakan panduan detail, validasi kualitas otomatis, permintaan ulang.
- **Ketergantungan pada OpenAI API** → Sediakan queue + retry, siapkan fallback manual review, evaluasi model cadangan.
- **Keterbatasan Dataset** → Rekrut ahli tambahan, gunakan active learning, kolaborasi komunitas lari.
- **Kepatuhan Privasi** → Konsultasi legal, anonymisasi metadata, hapus data sesuai permintaan.

## 13. Lampiran
- Referensi penelitian arch/pronasi (Staheli, Chippaux–Smirak, studi Mymo 2020).
- Struktur tabel database (lihat dokumen BMAD).
- Rancangan wireframe awal (tersedia pada repositori desain Figma).

