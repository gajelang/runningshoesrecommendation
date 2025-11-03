"use client"

import { Trash2, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SiteFooter } from "@/components/site-footer"

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([
    {
      id: 1,
      date: "2025-01-15",
      footType: "Neutral Arch",
      pronation: "Neutral",
      confidence: 94,
      topShoe: "Nike Air Zoom Pegasus 40",
      imageUrl: "/placeholder.svg?key=fflm8",
    },
    {
      id: 2,
      date: "2025-01-10",
      footType: "Neutral Arch",
      pronation: "Neutral",
      confidence: 92,
      topShoe: "Brooks Ghost 15",
      imageUrl: "/placeholder.svg?key=a0nbh",
    },
    {
      id: 3,
      date: "2025-01-05",
      footType: "High Arch",
      pronation: "Underpronation",
      confidence: 89,
      topShoe: "ASICS Gel-Contend 7",
      imageUrl: "/placeholder.svg?key=rml46",
    },
  ])

  const deleteAnalysis = (id: number) => {
    setAnalyses(analyses.filter((a) => a.id !== id))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Analysis History</h1>
            <p className="text-lg text-muted-foreground">
              View all your past footprint analyses and track changes over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-2">Total Analyses</div>
              <div className="text-3xl font-bold text-foreground">{analyses.length}</div>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-2">Most Recent</div>
              <div className="text-lg font-bold text-foreground">{formatDate(analyses[0].date)}</div>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-2">Avg Confidence</div>
              <div className="text-3xl font-bold text-foreground">
                {Math.round(analyses.reduce((a, b) => a + b.confidence, 0) / analyses.length)}%
              </div>
            </div>
          </div>

          {/* History Table */}
          {analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-secondary rounded-lg border border-border hover:border-primary/50 transition-all p-4 sm:p-6"
                >
                  <div className="grid md:grid-cols-6 gap-4 items-center">
                    {/* Image */}
                    <div className="md:col-span-1">
                      <div className="w-full aspect-square bg-background rounded-lg overflow-hidden">
                        <img
                          src={analysis.imageUrl || "/placeholder.svg"}
                          alt="Footprint analysis"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-3 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Analysis Date</p>
                        <p className="font-semibold text-foreground">{formatDate(analysis.date)}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Arch Type</p>
                          <p className="text-sm font-medium text-foreground">{analysis.footType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pronation</p>
                          <p className="text-sm font-medium text-foreground">{analysis.pronation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className="text-sm font-medium text-primary">{analysis.confidence}%</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Top Recommendation</p>
                        <p className="text-sm text-foreground">{analysis.topShoe}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 justify-end">
                      <Link
                        href="/results"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>

                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        onClick={() => deleteAnalysis(analysis.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted hover:text-accent transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-secondary rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground mb-6">No analyses yet. Start your first analysis today!</p>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Start Analysis
              </Link>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
