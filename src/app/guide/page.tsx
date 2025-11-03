/* eslint-disable react/no-unescaped-entities */
"use client"

import { ArrowLeft, CheckCircle, AlertCircle, Camera, Lightbulb } from "lucide-react"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export default function PhotoGuidePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold text-foreground">StrideFit</span>
          </div>

          <Link
            href="/analyze"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition"
          >
            Ready? Analyze
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">Perfect Your Footprint Photo</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Follow our simple guide to capture the perfect photo for accurate AI analysis.
          </p>
        </div>
      </section>

      {/* What You'll Need */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">What You'll Need</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-foreground mb-2">Smartphone</h3>
              <p className="text-muted-foreground text-sm">Any smartphone camera works. No special equipment needed.</p>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-3">🏳️</div>
              <h3 className="font-bold text-foreground mb-2">White Surface</h3>
              <p className="text-muted-foreground text-sm">
                Plain white paper, poster board, or white floor. Blank and clean.
              </p>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border">
              <div className="text-4xl mb-3">💧</div>
              <h3 className="font-bold text-foreground mb-2">Wet Your Foot</h3>
              <p className="text-muted-foreground text-sm">
                Dampen your sole slightly for a clear, complete impression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Step-by-Step Instructions</h2>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Prepare Your Surface</h3>
                <p className="text-muted-foreground mb-4">
                  Place a clean, dry sheet of white paper or poster board on a flat, level surface. Make sure there are
                  no wrinkles or folds. The surface should be large enough to capture your entire footprint.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">📄 White surface visualization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  2
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Dampen Your Sole</h3>
                <p className="text-muted-foreground mb-4">
                  Lightly dampen the bottom of your bare foot with water. It should be slightly wet, not dripping. This
                  creates a clear, visible impression that our AI can easily analyze.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">💧 Foot dampening visualization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  3
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Press Your Foot Down</h3>
                <p className="text-muted-foreground mb-4">
                  Stand with your full weight on one foot, pressing your sole firmly onto the white surface. Hold steady
                  for 2-3 seconds to create a complete, clear impression. Distribute your weight evenly.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">🦶 Foot pressing visualization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  4
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Position Your Camera</h3>
                <p className="text-muted-foreground mb-4">
                  Position your smartphone directly above the footprint, perpendicular to the paper. Make sure the
                  entire footprint is visible in the frame. Keep the camera steady—use a tripod if you have one.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">📸 Camera angle visualization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  5
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Ensure Good Lighting</h3>
                <p className="text-muted-foreground mb-4">
                  Take the photo in good lighting—natural daylight or well-lit indoor spaces work best. Avoid harsh
                  shadows or backlighting. The footprint should be clearly visible with good contrast.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">☀️ Good lighting visualization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  6
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-foreground mb-3">Take the Photo</h3>
                <p className="text-muted-foreground mb-4">
                  Capture the photo with your smartphone. Take multiple shots from slightly different angles to ensure
                  you have at least one perfect image. You can choose the best one when uploading.
                </p>
                <div className="bg-secondary rounded-lg p-4 border border-border">
                  <div className="w-full h-40 bg-background rounded flex items-center justify-center">
                    <span className="text-muted-foreground">📷 Photo capture visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Do's and Don'ts</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Do's
              </h3>

              <ul className="space-y-4">
                {[
                  "Use a clean, blank white surface",
                  "Keep the camera perpendicular to the footprint",
                  "Ensure adequate natural or well-lit artificial lighting",
                  "Capture the entire footprint in the frame",
                  "Keep the image sharp and in focus",
                  "Take multiple photos to choose the best one",
                  "Stand on one foot to show your natural weight distribution",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-accent" />
                Don'ts
              </h3>

              <ul className="space-y-4">
                {[
                  "Don't use colored or patterned backgrounds",
                  "Don't angle the camera—keep it straight overhead",
                  "Don't photograph in dim lighting or shadows",
                  "Don't crop the footprint at the edges",
                  "Don't use a blurry or out-of-focus image",
                  "Don't capture only part of the foot",
                  "Don't apply heavy pressure—just your normal weight",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Pro Tips for Best Results</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-foreground">Use a Ruler for Scale</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Place a ruler or measuring scale in the frame for reference. This helps our AI accurately assess foot
                dimensions.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-foreground">Clean Up Between Attempts</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                If the first footprint isn't clear, dry your foot and the paper, then dampen again for a fresh
                impression.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-foreground">Test Different Lighting</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Try both natural sunlight and indoor lighting to see which creates the best contrast between the
                footprint and background.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-6 border border-border">
              <div className="flex items-start gap-3 mb-4">
                <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-foreground">Download High Resolution</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Use your phone's highest resolution setting when available. Higher quality images improve analysis
                accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Analyze Your Footprint?</h2>
          <p className="text-lg opacity-90 mb-8">
            You now have everything you need to capture the perfect photo. Let's find your ideal running shoes.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition"
          >
            Upload Your Photo
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
