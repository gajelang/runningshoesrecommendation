import type { Metadata } from "next";
import Link from "next/link";

import { LiDARScanClient } from "@/components/lidar-scan-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "LiDAR Scan | StrideFit",
  description:
    "Capture a LiDAR depth map of your footprint to enhance AI-powered shoe recommendations. Works on Safari with iPhone/iPad Pro.",
};

export default function ScanPage() {
  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back home
        </Link>
        <h1 className="mt-3 text-4xl font-bold">LiDAR Capture</h1>
        <p className="mt-3 text-muted-foreground">
          Gunakan perangkat dengan LiDAR (Safari iOS/iPadOS) untuk menangkap depth map telapak kaki. Depth map yang
          berhasil tersimpan akan otomatis tersedia di halaman Analisis.
        </p>

        <div className="mt-10">
          <LiDARScanClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
