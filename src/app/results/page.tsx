"use client"

import { ArrowLeft, Download, Share2, Heart, Star, TrendingUp, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SiteFooter } from "@/components/site-footer"

export default function ResultsPage() {
  const [liked, setLiked] = useState<string[]>([])

  // Mock data for demo purposes
  const footAnalysis = {
    archType: "neutral",
    pronation: "neutral",
    confidence: 94,
    footType: "Neutral Arch",
    description: "Your foot has a neutral arch with no significant pronation issues.",
  }

  const recommendations = [
    {
      id: 1,
      name: "Nike Air Zoom Pegasus 40",
      brand: "Nike",
      category: "Neutral Road Running",
      price: "$129.99",
      match: 96,
      features: ["Responsive cushioning", "Neutral support", "Lightweight", "Great for daily runs"],
      image: "/neutral-running-shoe-nike.jpg",
    },
    {
      id: 2,
      name: "Brooks Ghost 15",
      brand: "Brooks",
      category: "Neutral Road Running",
      price: "$139.99",
      match: 94,
      features: ["DNA Loft v2 cushioning", "Smooth transitions", "Neutral support", "Durable"],
      image: "/neutral-running-shoe-brooks.jpg",
    },
    {
      id: 3,
      name: "ASICS Gel-Contend 7",
      brand: "ASICS",
      category: "Neutral Road Running",
      price: "$109.99",
      match: 91,
      features: ["Gel cushioning", "Neutral support", "Reliable comfort", "Budget-friendly"],
      image: "/neutral-running-shoe-asics.jpg",
    },
    {
      id: 4,
      name: "New Balance 520 v8",
      brand: "New Balance",
      category: "Neutral Road Running",
      price: "$119.99",
      match: 89,
      features: ["REVlite cushioning", "Neutral support", "Wide toe box", "Good stability"],
      image: "/neutral-running-shoe-new-balance.jpg",
    },
  ]

  const insights = [
    {
      icon: TrendingUp,
      title: "Arch Analysis",
      description: "Your neutral arch provides balanced weight distribution, making you suitable for most shoe types.",
    },
    {
      icon: Zap,
      title: "Pronation Pattern",
      description:
        "Neutral pronation means your foot rolls naturally during running without excessive inward or outward motion.",
    },
    {
      icon: Shield,
      title: "Injury Prevention",
      description: "Focus on shoes with good cushioning and neutral support to maintain optimal running biomechanics.",
    },
  ]

  const toggleLike = (id: string) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold text-foreground">StrideFit</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-lg transition">
              <Download className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Your Analysis Results</h1>
            <p className="text-lg text-muted-foreground">
              Based on your footprint analysis, we found 4 perfect shoe recommendations for you
            </p>
          </div>

          {/* Foot Analysis Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 border border-primary/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Foot Profile</h2>
                <p className="text-muted-foreground">Based on AI analysis of your footprint image</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-foreground font-medium">Arch Type</span>
                  <span className="text-primary font-bold text-lg">{footAnalysis.footType}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <span className="text-foreground font-medium">Pronation Pattern</span>
                  <span className="text-primary font-bold text-lg capitalize">{footAnalysis.pronation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Analysis Confidence</span>
                  <span className="text-primary font-bold text-lg">{footAnalysis.confidence}%</span>
                </div>
              </div>

              <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{footAnalysis.description}</p>
            </div>

            {/* Confidence Gauge */}
            <div className="bg-secondary rounded-lg p-8 border border-border flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-10" />
                <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{footAnalysis.confidence}%</div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                High confidence analysis based on footprint data
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Key Insights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((insight, i) => {
                const Icon = insight.icon
                return (
                  <div key={i} className="bg-secondary rounded-lg p-6 border border-border">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold text-foreground mb-2">{insight.title}</h3>
                    <p className="text-muted-foreground text-sm">{insight.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Shoe Recommendations */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Recommended Running Shoes</h2>

            <div className="space-y-6">
              {recommendations.map((shoe) => (
                <div
                  key={shoe.id}
                  className="bg-secondary rounded-lg border border-border overflow-hidden hover:border-primary transition-all duration-300"
                >
                  <div className="grid md:grid-cols-4 gap-6 p-6">
                    {/* Image */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <div className="w-full aspect-square bg-background rounded-lg overflow-hidden">
                        <img
                          src={shoe.image || "/placeholder.svg"}
                          alt={shoe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-primary font-semibold mb-1">{shoe.brand}</p>
                        <h3 className="text-xl font-bold text-foreground mb-1">{shoe.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{shoe.category}</p>

                        <div className="space-y-2">
                          {shoe.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-lg font-bold text-foreground mt-4">{shoe.price}</p>
                    </div>

                    {/* Match Score & Actions */}
                    <div className="md:col-span-1 flex flex-col items-end justify-between">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">Match</span>
                        </div>
                        <div className="text-3xl font-bold text-primary">{shoe.match}%</div>
                        <div className="flex gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(shoe.match / 20) ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleLike(shoe.id.toString())}
                        className="w-10 h-10 rounded-lg bg-background hover:bg-muted transition flex items-center justify-center"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            liked.includes(shoe.id.toString()) ? "fill-accent text-accent" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Buy?</h2>
            <p className="mb-6 opacity-90">
              Find these shoes at your favorite retailers or use our store locator to find inventory near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition">
                View Store Locations
              </button>
              <button className="px-8 py-3 bg-primary-foreground/20 text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/30 transition border border-primary-foreground/30">
                Save for Later
              </button>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">Want to analyze another footprint or compare results?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/analyze"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Analyze Another Foot
              </Link>
              <Link
                href="/history"
                className="px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted transition border border-border"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
