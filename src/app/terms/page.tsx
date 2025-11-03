/* eslint-disable react/no-unescaped-entities */
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 2025</p>

          <div className="space-y-8">
            {/* Agreement */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using StrideFit, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Use License */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on
                StrideFit for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on StrideFit</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The materials on StrideFit are provided on an "as is" basis. StrideFit makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The AI-powered recommendations are for informational purposes only and should not be considered as
                professional medical or podiatric advice. Always consult with a healthcare professional for medical
                concerns.
              </p>
            </section>

            {/* Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall StrideFit or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on StrideFit, even if we or our authorized representative has been notified orally
                or in writing of the possibility of such damage.
              </p>
            </section>

            {/* Accuracy of Materials */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on StrideFit could include technical, typographical, or photographic errors.
                StrideFit does not warrant that any of the materials on our website are accurate, complete, or current.
                We may make changes to the materials contained on our website at any time without notice.
              </p>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                StrideFit has not reviewed all of the sites linked to its website and is not responsible for the
                contents of any such linked site. The inclusion of any link does not imply endorsement by StrideFit of
                the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                StrideFit may revise these terms of service for its website at any time without notice. By using this
                website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the United
                States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-secondary rounded-lg p-4 border border-border">
                <p className="text-foreground font-medium">StrideFit Support</p>
                <p className="text-muted-foreground">Email: support@stridefit.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
