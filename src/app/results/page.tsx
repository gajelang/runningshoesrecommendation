import Link from "next/link";

export default function ResultsIndexPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold text-foreground">Where are my results?</h1>
      <p className="text-muted-foreground">
        Upload a footprint via the <Link href="/analyze" className="text-primary underline">analysis flow</Link> to
        generate personalised recommendations. After your analysis completes, you&apos;ll be redirected to a results
        page like <code>/results/scan-id</code>.
      </p>
    </div>
  );
}

