/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"

const INITIAL_FORM_STATE = {
  age: "",
  weight: "",
  activity: "",
  issues: "",
  email: "",
}

export default function AnalyzePage() {
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<{ scanId: string; imageUrl: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form data state
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0]
    if (nextFile) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setFileName(nextFile.name)
        setFile(nextFile)
      }
      reader.readAsDataURL(nextFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setFileName(dropped.name)
        setFile(dropped)
      }
      reader.readAsDataURL(dropped)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isStep1Complete = file !== null
  const isStep2Complete = formData.age && formData.weight && formData.activity
  const isStep3Complete = formData.email

  const canContinue = step === 1 ? isStep1Complete : step === 2 ? isStep2Complete : step === 3 ? isStep3Complete : true

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setSubmitError("Footprint photo is required before submitting.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload = new FormData()
      payload.append("file", file)
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          payload.append(key, value)
        }
      })

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: payload,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? "Failed to upload footprint. Please try again.")
      }

      const result = (await response.json()) as { scanId: string; imageUrl: string }
      setUploadResult(result)
      setStep(4)
    } catch (error) {
      console.error("Submission error", error)
      setSubmitError(error instanceof Error ? error.message : "Unexpected error during upload.")
    } finally {
      setIsSubmitting(false)
    }
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

          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      s < step
                        ? "bg-primary text-primary-foreground"
                        : s === step
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <span className="text-xs text-muted-foreground mt-2 text-center">
                    {s === 1 && "Upload Photo"}
                    {s === 2 && "Your Info"}
                    {s === 3 && "Contact"}
                    {s === 4 && "Complete"}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress line */}
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Upload Photo */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Footprint</h1>
                <p className="text-muted-foreground">
                  Choose or drag a photo of your footprint to get started with your analysis.
                </p>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  image ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload footprint image"
                />

                {image ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-secondary">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Footprint preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">File: {fileName}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setImage(null)
                          setFileName(null)
                          setFile(null)
                        }}
                        className="text-xs text-primary hover:underline mt-2"
                      >
                        Choose Different Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Drag and drop your photo here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">PNG, JPG, or GIF up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Follow our{" "}
                  <Link href="/guide" className="text-primary hover:underline">
                    photo guide
                  </Link>{" "}
                  for best results. Make sure your footprint is clear, well-lit, and captures your entire sole.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Your Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Tell Us About Yourself</h1>
                <p className="text-muted-foreground">
                  This helps us provide more personalized running shoe recommendations.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-foreground mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-foreground mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter your weight"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-foreground mb-2">
                    Running Activity Level
                  </label>
                  <select
                    id="activity"
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select your activity level</option>
                    <option value="casual">Casual (1-3 miles/week)</option>
                    <option value="moderate">Moderate (3-10 miles/week)</option>
                    <option value="active">Active (10-20 miles/week)</option>
                    <option value="competitive">Competitive (20+ miles/week)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="issues" className="block text-sm font-medium text-foreground mb-2">
                    Any Foot Issues? (Optional)
                  </label>
                  <textarea
                    id="issues"
                    name="issues"
                    value={formData.issues}
                    onChange={handleInputChange}
                    placeholder="e.g., flat feet, high arches, bunions, previous injuries..."
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Your Contact Info</h1>
                <p className="text-muted-foreground">
                  We'll send your personalized shoe recommendations and analysis report to this email.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-secondary rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Privacy:</strong> We'll only use your email to send your results and analysis. We never share
                  your data with third parties.
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-medium text-foreground mb-3">Analysis Summary</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Footprint uploaded: {fileName}</p>
                  <p>✓ Age: {formData.age}</p>
                  <p>✓ Weight: {formData.weight} lbs</p>
                  <p>✓ Activity Level: {formData.activity}</p>
                  {formData.issues && <p>✓ Foot Issues: {formData.issues}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Analysis Complete!</h1>
                <p className="text-muted-foreground">
                  Your footprint is being analyzed by our AI engine. We're finding your perfect running shoes...
                </p>
              </div>

              <div className="space-y-3 py-6">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Photo Processed</p>
                    <p className="text-sm text-muted-foreground">Your footprint image has been received and analyzed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Profile Created</p>
                    <p className="text-sm text-muted-foreground">Your foot type and preferences have been saved</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Results Ready</p>
                    <p className="text-sm text-muted-foreground">Personalized recommendations await you below</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <Link
                  href={uploadResult?.scanId ? `/results/${uploadResult.scanId}` : "/results"}
                  className="block w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition text-center"
                >
                  View Your Results
                </Link>
                <Link
                  href="/"
                  className="block w-full px-8 py-4 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted transition text-center border border-border"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 mt-12">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  step === 1
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-secondary text-foreground hover:bg-muted border border-border"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={() => {
                  if (step === 3) {
                    void handleSubmit()
                  } else {
                    handleNext()
                  }
                }}
                disabled={
                  !canContinue || (step === 3 && (isSubmitting || file === null))
                }
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  canContinue && !(step === 3 && (isSubmitting || file === null))
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {step === 3 ? (isSubmitting ? "Submitting..." : "Submit Analysis") : "Next"}
                {step < 3 && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          )}

          {submitError && (
            <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submitError}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
