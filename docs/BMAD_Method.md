# BMAD Implementation Plan

Metodologi BMAD (Build – Measure – Analyze – Deploy) digunakan untuk mengelola pengembangan sistem rekomendasi sepatu berbasis Next.js dan GPT Vision. Dokumen ini mendetilkan aktivitas, artefak, peran, serta kriteria keberhasilan pada setiap fase.

## Ringkasan Timeline
| Fase | Durasi Estimasi | Keluaran Kunci | Gate Review |
| :-- | :-- | :-- | :-- |
| Build | 6 minggu | MVP fungsional dengan pipeline AI dan rule engine v1 | Internal demo & checklist QA Build |
| Measure | 4 minggu | Instrumentasi metrik, dataset evaluasi, laporan uji awal | Review metrik & validasi model |
| Analyze | 4 minggu | Insight produk & model, backlog prioritas, iterasi UX | Rapat steering, rencana iterasi |
| Deploy | 4 minggu | Rilis beta publik, dokumen operasional, rencana scaling | Go/No-Go meeting |

## 1. Build
**Tujuan:** Membangun fondasi produk termasuk arsitektur, integrasi AI, dan fitur utama alur analisis.

**Aktivitas Utama**
- Finalisasi arsitektur sistem dan diagram data.
- Setup repositori Next.js + TypeScript + Tailwind + konfigurasi lint/test.
- Implementasi modul upload jejak kaki, form profil, server action ke GPT Vision.
- Pengembangan rule engine berbasis JSON + unit test kombinasi arch/pronasi.
- Integrasi database (Postgres) dan storage, skema `users`, `foot_scans`, `recommendations`, `shoe_catalog`, `events`.
- Implementasi autentikasi NextAuth dan manajemen sesi dasar.
- Setup DevOps (Vercel staging/prod, CI lint/test, environment secrets).

**Artefak**
- Dokumentasi arsitektur (C4 diagram, data flow).
- Story backlog & board sprint.
- Template prompt GPT Vision + versi baseline.
- Test suite (unit untuk rule engine, integrasi upload → rekomendasi).
- Checklists privasi & keamanan awal.

**Peran**
- Lead Engineer, ML Engineer, Product Designer, Research Advisor, QA.

**Kriteria Kelulusan**
- End-to-end flow (upload → rekomendasi) berhasil pada staging dengan data dummy.
- Cakupan test unit ≥70% untuk rule engine; CI hijau.
- Dokumen keamanan & privasi disetujui pembimbing.
- Panduan pengguna internal dan video demo tersedia.

## 2. Measure
**Tujuan:** Mengukur kinerja teknis dan pengalaman pengguna melalui telemetry, eksperimen, dan uji terkontrol.

**Aktivitas Utama**
- Konfigurasi logging event (upload, analisis sukses/gagal, klik rekomendasi).
- Implementasi Vercel Analytics, Sentry, dan pipeline audit panggilan GPT.
- Persiapan dataset labeled (SAI/CSI) untuk validasi; jalankan batch evaluasi GPT Vision.
- Definisikan KPI (accuracy, recall pronasi, completion rate, latency) + dashboard Metabase.
- Laksanakan uji tertutup dengan 15-20 pelari; kumpulkan feedback kualitatif.
- Dokumentasikan prosedur QA regresi dan penanganan insiden.

**Artefak**
- Dashboard metrik (Metabase/Looker Studio).
- Laporan evaluasi model vs label ahli.
- Catatan usability testing & rekomendasi perbaikan.
- SOP monitoring & alerting.

**Peran**
- Data Analyst, ML Engineer, UX Researcher, QA.

**Kriteria Kelulusan**
- Latency median <3 detik; tingkat kegagalan API <5%.
- AUC arch ≥0.85; recall pronasi ≥0.8 pada dataset validasi.
- Dokumentasi feedback dengan rencana tindak lanjut disetujui product owner.
- Sistem logging & alert berfungsi (diuji dengan simulasi incident).

## 3. Analyze
**Tujuan:** Menginterpretasi data pengukuran, mengidentifikasi gap, dan merencanakan iterasi produk/teknologi.

**Aktivitas Utama**
- Analisis cohort (per gender, ukuran kaki, tipe latihan) untuk memantau bias.
- Review log rekomendasi untuk mengkaji kasus tidak relevan; update rule engine.
- A/B test prompt GPT Vision atau parameter rule untuk peningkatan akurasi.
- Sinkronisasi produk dan tim riset untuk memutuskan perubahan roadmap.
- Update PRD & backlog berdasarkan insight terbaru.

**Artefak**
- Laporan analitik mingguan (temuan + keputusan).
- Versi rule engine & prompt dengan catatan perubahan.
- Dokumen risiko terbaru dan mitigasi yang diperbarui.
- Rencana sprint berikutnya yang telah disepakati.

**Peran**
- Product Manager, ML Engineer, Data Analyst, Stakeholder Research.

**Kriteria Kelulusan**
- Temuan kritikal tertangani dengan action item ter-prioritas.
- Stakeholder menyetujui backlog iterasi; roadmap direvisi.
- Tidak ada anomali metrik utama tanpa rencana tindakan.

## 4. Deploy
**Tujuan:** Menyelesaikan rilis publik terkontrol, memastikan kesiapan operasional, dan mempersiapkan scaling.

**Aktivitas Utama**
- Harden security (rate limiting, sanitasi input, audit dependency).
- Migrasi konfigurasi produksi (domain, SSL, environment secrets final).
- Siapkan konten edukasi, FAQ, privacy policy, consent digital.
- Jalankan closed beta besar (50+ pengguna), finalisasi manual dukungan.
- Susun rencana roll-out bertahap & mekanisme rollback.
- Latih tim support dan dokumentasi troubleshooting.

**Artefak**
- Checklist rilis final, runbook incident, SLA internal.
- Dokumen privasi & ketentuan penggunaan.
- Catatan training tim support & FAQ publik.
- Laporan beta dengan rencana iterasi pasca-rilis.

**Peran**
- DevOps, Security Engineer, Product Manager, Customer Support, Legal (bila tersedia).

**Kriteria Kelulusan**
- Semua item checklist rilis tertandai; zero blocker severity tinggi.
- Sistem monitoring dan alert real-time aktif di produksi.
- Persetujuan formal (Go) dari steering committee/pembimbing.
- Rilis produksi tersaji di Vercel dengan domain final dan fallback plan.

## Manajemen Risiko
| Risiko | Dampak | Probabilitas | Mitigasi |
| :-- | :-- | :-- | :-- |
| API GPT Vision lambat/limit | Latency tinggi, UX buruk | Sedang | Implement queue, caching hasil, parallel upload limit. |
| Data labeling tidak konsisten | Akurasi turun | Rendah-Sedang | Double review ahli, gunakan kappa statistic, retraining berkala. |
| Kebocoran data sensitif | Reputasi buruk | Rendah | Enkripsi, least-privilege access, audit log, anonymization. |
| Keterbatasan resource tim | Jadwal molor | Sedang | Prioritas fitur Must-have, gunakan sprint buffer, libatkan volunteer. |

## Governance & Komunikasi
- **Ritme**: Standup 3x/minggu, review sprint 2 minggu, steering meeting bulanan.
- **Repositori Dokumentasi**: `/docs/PRD.md`, `/docs/BMAD_Method.md`, Notion/Confluence untuk catatan rapat.
- **Persetujuan**: Pembimbing skripsi sebagai sponsor, product owner internal sebagai penentu prioritas.
- **Quality Gates**: QA sign-off setiap fase; checklist privasi sebelum data dikumpulkan; UAT sebelum deploy.

## Lampiran
- Template prompt GPT Vision (tersedia di repo `src/prompts/footprint.ts` – disiapkan pada fase Build).
- Struktur database terperinci dan ERD.
- Format laporan metrik mingguan (Google Sheet/Notion).
- Panduan pengujian manual upload → rekomendasi.

