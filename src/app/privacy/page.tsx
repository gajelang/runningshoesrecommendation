/* eslint-disable react/no-unescaped-entities */
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 2025</p>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                StrideFit ("Company," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website and
                use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    We collect information you voluntarily provide to us, such as your email address, age, weight, and
                    any health information you share to improve our recommendations.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Footprint Images</h3>
                  <p className="text-muted-foreground">
                    We collect and store images of your footprints to perform analysis and improve our AI models. These
                    images are encrypted and securely stored.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                  <p className="text-muted-foreground">
                    We collect information about how you interact with our service, including the features you use, the
                    analyses you perform, and your click patterns.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>To provide and improve our shoe recommendation service</li>
                <li>To send you personalized recommendations and analysis reports</li>
                <li>To train and improve our AI analysis algorithms</li>
                <li>To communicate with you about updates and changes to our service</li>
                <li>To prevent fraud and ensure security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. All data is transmitted over secure
                HTTPS connections and stored in encrypted databases.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Right to access your personal information</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent at any time</li>
              </ul>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-secondary rounded-lg p-4 border border-border mt-4">
                <p className="text-foreground font-medium">StrideFit Support</p>
                <p className="text-muted-foreground">Email: privacy@stridefit.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
