import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { footScans } from "@/db/schema";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { RecommendationMetadata, ShoeFeatures, StoredAnalysis } from "@/lib/types";

function asShoeFeatures(value: unknown): ShoeFeatures {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as ShoeFeatures;
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{
    scanId: string;
  }>;
}) {
  const { scanId } = await params;

  const scan = await db.query.footScans.findFirst({
    where: eq(footScans.id, scanId),
    with: {
      recommendations: {
        with: {
          shoe: true,
        },
      },
    },
  });

  if (!scan) {
    notFound();
  }

  const raw = (scan.rawAnalysis as StoredAnalysis) ?? {};
  const profile = raw.profile ?? {};
  const aiError = typeof raw.aiError === "string" ? raw.aiError : null;
  const ai = raw.ai ?? {
    archType: scan.archType,
    pronationType: scan.pronationType,
    archConfidence: scan.archConfidence,
    pronationConfidence: scan.pronationConfidence,
  };
  const plan = raw.plan ?? null;
  const depthSummary = raw.depthSummary ?? null;
  const depthStats = (depthSummary?.stats as Record<string, number | undefined>) ?? null;
  const scanType = (scan as { scanType?: string | null }).scanType ?? (depthSummary ? "lidar" : "photo");

  const confidence =
    typeof scan.archConfidence === "number" && typeof scan.pronationConfidence === "number"
      ? Math.round((scan.archConfidence + scan.pronationConfidence) / 2)
      : plan?.confidence ?? 0;

  const recommendations = scan.recommendations ?? [];

  return (
    <div className="bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <header className="mb-16">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back home
          </Link>
          <h1 className="mt-3 text-4xl font-bold">Your analysis results</h1>
          <p className="mt-3 text-muted-foreground">
            Scan ID <code className="text-xs">{scanId}</code>
          </p>
        </header>

        <section className="mb-12 grid gap-6 md:grid-cols-3">
          <article className="md:col-span-2 space-y-6 rounded-xl border border-border bg-secondary/30 p-6">
            <div>
              <h2 className="text-2xl font-semibold">Footprint summary</h2>
              <p className="text-sm text-muted-foreground">
                Based on your uploaded footprint and profile information.
              </p>
            </div>
            {aiError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Analysis failed: {aiError}. Please upload a new footprint and try again.
              </div>
            ) : null}
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Arch type</dt>
                <dd className="mt-2 text-lg font-semibold capitalize">{ai.archType ?? "unknown"}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Pronation</dt>
                <dd className="mt-2 text-lg font-semibold capitalize">{ai.pronationType ?? "unknown"}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</dt>
                <dd className="mt-2 text-lg font-semibold">{confidence ? `${confidence}%` : "—"}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Profile</dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  {[
                    profile.age ? `Age ${profile.age}` : null,
                    profile.weight ? `Weight ${profile.weight} kg` : null,
                    profile.activity ? `Activity ${profile.activity}` : null,
                  ]
                    .filter(Boolean)
                    .join(" • ") || "No extra profile info"}
                </dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Scan method</dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  {scanType === "lidar" ? "Photo + LiDAR depth map" : "Photo only"}
                </dd>
                <dd className="mt-1 text-xs text-muted-foreground">
                  {depthStats
                    ? `Depth intensity range (0-255): ${depthStats.min ?? 0} – ${depthStats.max ?? 0}, mean ${
                        depthStats.mean ?? 0
                      }`
                    : "No depth metrics captured"}
                </dd>
              </div>
            </dl>
            {plan?.summary ? (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                <p className="text-sm text-primary">{plan.summary}</p>
              </div>
            ) : null}
          </article>

          <aside className="flex flex-col justify-between rounded-xl border border-border bg-secondary/30 p-6">
            <div>
              <h3 className="text-lg font-semibold">Need help?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Save this link or share it with a specialist for a second opinion. You can always re-run the analysis
                with another footprint.
              </p>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Email used: {profile.email ?? "not provided"}</p>
              <p>Processed at: {scan.processedAt?.toLocaleString() ?? "—"}</p>
            </div>
          </aside>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold">Recommended shoes</h2>
          <p className="text-sm text-muted-foreground">
            We matched your gait profile with shoes from our catalogue. Rankings consider arch/pronation match, intended
            usage, and the data scraped from RunRepeat.
          </p>

          {recommendations.length === 0 ? (
            <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
              We couldn&apos;t find a confident match for this scan. Try uploading another footprint or refining your
              profile details.
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {recommendations.map((recommendation) => {
                const shoe = recommendation.shoe;
                const meta = (recommendation.metadata as RecommendationMetadata) ?? {};
                const snapshot = meta.shoeSnapshot ?? {};

                const displayBrand = shoe?.brand ?? snapshot.brand ?? "Unknown brand";
                const displayModel = shoe?.model ?? snapshot.model ?? "Unknown model";
                const matchPercent = meta.matchPercent ?? 0;
                const rationale =
                  recommendation.rationale ??
                  plan?.categories.find((rule) => rule.category === recommendation.category)?.rationale ??
                  "Matches your gait profile.";

                const shoeFeatures = asShoeFeatures(shoe?.features ?? snapshot.features);
                const metrics = shoeFeatures.metrics ?? {};
                const useCase = shoeFeatures.useCase ?? [];

                return (
                  <div
                    key={recommendation.id}
                    className="rounded-xl border border-border bg-secondary/30 p-6 transition hover:border-primary/60"
                  >
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {displayBrand} {displayModel}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Category: <span className="capitalize">{recommendation.category}</span> · Match score{" "}
                          <span className="font-medium text-primary">{matchPercent}%</span>
                        </p>
                      </div>
                    </header>

                    <p className="mt-4 text-sm text-muted-foreground">{rationale}</p>

                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">Use case</dt>
                        <dd className="mt-1 capitalize">
                          {useCase.length > 0 ? useCase.join(", ") : "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">Stack / drop</dt>
                        <dd className="mt-1">
                          {metrics.stackHeightMm
                            ? `${metrics.stackHeightMm.heel ?? "?"}mm / ${metrics.stackHeightMm.forefoot ?? "?"}mm`
                            : "—"}{" "}
                          · drop {metrics.dropMm ?? "—"}mm
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-muted-foreground">Weight</dt>
                        <dd className="mt-1">{metrics.weightGrams ? `${metrics.weightGrams} g` : "—"}</dd>
                      </div>
                    </dl>

                    <footer className="mt-4 text-sm text-muted-foreground">
                      {(shoeFeatures.pros as string[])?.slice(0, 3).map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </footer>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-secondary/20 p-6">
          <h3 className="text-lg font-semibold">Need adjustments?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you want to tweak your preferences (tempo vs long run, more stability, etc.), head back to the analysis
            flow and update your profile. We&apos;ll learn more from each footprint you submit.
          </p>
          {profile.email ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Looking for previous scans? Buka{" "}
              <Link href={`/history?email=${encodeURIComponent(profile.email)}`} className="text-primary underline">
                halaman riwayat
              </Link>{" "}
              untuk melihat semua hasil dengan email tersebut.
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Start a new analysis
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              View history
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
