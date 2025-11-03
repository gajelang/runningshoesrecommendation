import { ArrowRight, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-secondary border border-border rounded-full mb-6">
            <span className="text-xs font-semibold text-primary">AI-Powered Shoe Analysis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect Running Shoe
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Upload a photo of your footprint and let our AI analyze your arch type and pronation to recommend the ideal
            running shoes for your feet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
            >
              See Photo Guide
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-96 bg-gradient-to-b from-primary/10 to-background rounded-2xl border border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">Upload footprint photo to get started</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to find your perfect shoe</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Upload Photo</h3>
              <p className="text-center text-muted-foreground">
                Take a clear photo of your bare footprint on a white surface using our guide.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI Analysis</h3>
              <p className="text-center text-muted-foreground">
                Our AI analyzes your arch type and pronation pattern in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Get Recommendations</h3>
              <p className="text-center text-muted-foreground">
                Receive personalized shoe recommendations based on your unique foot type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-16 text-center">Why Choose StrideFit</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">Accurate AI Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced computer vision identifies arch type and pronation patterns with precision.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">Science-Backed</h3>
                <p className="text-muted-foreground">
                  Recommendations based on peer-reviewed research and biomechanics principles.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">Fast Results</h3>
                <p className="text-muted-foreground">Get personalized recommendations in seconds, not days.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">Shareable Reports</h3>
                <p className="text-muted-foreground">
                  Download PDF reports and share your analysis with friends or specialists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "How accurate is the AI analysis?",
                a: "Our system analyzes over 100 biomechanical metrics with 95%+ accuracy compared to professional assessments.",
              },
              {
                q: "What photo quality do I need?",
                a: "Use a smartphone camera in good lighting. Our guide shows exactly how to take the perfect footprint photo.",
              },
              {
                q: "Can I analyze multiple times?",
                a: "Yes! Track your history and re-analyze anytime. Your previous results are saved for comparison.",
              },
              {
                q: "How do I use the recommendations?",
                a: "Visit recommended shoe retailers or use the store locator links to find shoes that match your profile.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0">
                <h3 className="font-bold text-lg text-foreground mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Find Your Perfect Shoe?</h2>
          <p className="text-lg opacity-90 mb-8">
            Start your free analysis today and discover shoes designed for your unique feet.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition"
          >
            Begin Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
