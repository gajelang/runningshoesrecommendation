import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { footScans, users } from "@/db/schema";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { RecommendationMetadata, StoredAnalysis } from "@/lib/types";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type HistorySearchParams =
  | {
      email?: string | string[];
    }
  | Promise<{
      email?: string | string[];
    }>;

interface HistoryPageProps {
  searchParams?: HistorySearchParams;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const resolved = (await Promise.resolve(searchParams)) ?? {};
  const rawEmail = resolved.email;
  const requestedEmail =
    typeof rawEmail === "string"
      ? rawEmail.trim().toLowerCase()
      : Array.isArray(rawEmail)
        ? rawEmail[0]?.trim().toLowerCase()
        : undefined;

  let userFilterId: string | null = null;
  if (requestedEmail) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, requestedEmail),
    });
    userFilterId = user?.id ?? null;
  }

  const scans = await db.query.footScans.findMany({
    where: userFilterId ? eq(footScans.userId, userFilterId) : undefined,
    orderBy: desc(footScans.processedAt),
    with: {
      recommendations: {
        with: {
          shoe: true,
        },
      },
      user: {
        columns: {
          email: true,
          name: true,
        },
      },
    },
    limit: 40,
  });

  const total = scans.length;
  const latest = scans[0] ?? null;
  const avgConfidence =
    scans.length > 0
      ? Math.round(
          scans.reduce((sum, scan) => sum + (scan.archConfidence ?? 0), 0) / scans.length,
        )
      : 0;

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <header className="mb-14">
          <h1 className="text-4xl font-bold">Analysis history</h1>
          <p className="mt-2 text-muted-foreground">
            Each entry below is a footprint scan processed by the AI engine. Select any row to review its
            recommendations.
          </p>
        </header>

        <section className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total analyses</p>
            <p className="mt-3 text-3xl font-semibold">{total}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Most recent</p>
            <p className="mt-3 text-lg font-medium">{formatDate(latest?.processedAt ?? null)}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Average arch confidence</p>
            <p className="mt-3 text-3xl font-semibold">{avgConfidence ? `${avgConfidence}%` : "—"}</p>
          </div>
        </section>

        {scans.length === 0 ? (
          <div className="rounded-xl border border-border bg-secondary/30 p-12 text-center text-sm text-muted-foreground">
            {requestedEmail ? (
              <>
                Tidak ditemukan analisis untuk email <strong>{requestedEmail}</strong>. Pastikan kamu memasukkan alamat
                email yang sama dengan yang digunakan saat upload.
              </>
            ) : (
              <>
                Belum ada analisis. Mulai dengan{" "}
                <Link href="/analyze" className="text-primary underline">
                  upload footprint pertama
                </Link>{" "}
                atau tambahkan parameter <code>?email=alamat@email.com</code> untuk melihat histori tertentu.
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => {
              const raw = (scan.rawAnalysis as StoredAnalysis) ?? {};
              const ai = raw.ai ?? {};
              const profile = raw.profile ?? {};
              const topRecommendation = scan.recommendations?.[0];
              const shoe = topRecommendation?.shoe;
              const metadata = (topRecommendation?.metadata as RecommendationMetadata) ?? {};
              const shoeSnapshot = metadata.shoeSnapshot ?? {};

              return (
                <Link
                  key={scan.id}
                  href={`/results/${scan.id}`}
                  className="block rounded-xl border border-border bg-secondary/20 p-6 transition hover:border-primary/50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {formatDate(scan.processedAt)}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        Arch: <span className="capitalize">{ai.archType ?? scan.archType ?? "—"}</span> · Pronation:{" "}
                        <span className="capitalize">{ai.pronationType ?? scan.pronationType ?? "—"}</span>
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {profile.email
                          ? `Email: ${profile.email}`
                          : scan.user?.email
                            ? `Email: ${scan.user.email}`
                            : "Email tidak tersedia"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Confidence {scan.archConfidence ?? "—"}%</p>
                      <p>
                        Top shoe:{" "}
                        {shoe
                          ? `${shoe.brand} ${shoe.model}`
                          : shoeSnapshot.brand
                            ? `${shoeSnapshot.brand} ${shoeSnapshot.model}`
                            : "—"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
