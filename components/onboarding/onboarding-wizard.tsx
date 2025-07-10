"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Coffee, Building2, Users, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"

interface BusinessData {
  name: string
  slug: string
  description: string
  industry: string
  address: string
  phone: string
  email: string
  timezone: string
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    slug: "",
    description: "",
    industry: "coffee_shop",
    address: "",
    phone: "",
    email: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleBusinessNameChange = (name: string) => {
    setBusinessData({
      ...businessData,
      name,
      slug: generateSlug(name),
    })
  }

  const createBusiness = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/businesses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(businessData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create business")
      }

      toast.success("Business created successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      createBusiness()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return businessData.name.trim() !== "" && businessData.industry !== ""
      case 2:
        return businessData.email.trim() !== ""
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Coffee className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ShiftFlow!</h1>
        <p className="text-gray-600">Let's set up your business in just a few steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step <= currentStep ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            {currentStep === 1 && <Building2 className="w-6 h-6 text-orange-500" />}
            {currentStep === 2 && <Coffee className="w-6 h-6 text-orange-500" />}
            {currentStep === 3 && <Users className="w-6 h-6 text-orange-500" />}
            <div>
              <CardTitle>
                {currentStep === 1 && "Business Basics"}
                {currentStep === 2 && "Contact Information"}
                {currentStep === 3 && "Ready to Launch!"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your business"}
                {currentStep === 2 && "How can customers reach you?"}
                {currentStep === 3 && "Your business is ready to go"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Business Basics */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Brew & Bean Coffee"
                  value={businessData.name}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessSlug">URL Slug</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">shiftflow.com/</span>
                  <Input
                    id="businessSlug"
                    value={businessData.slug}
                    onChange={(e) => setBusinessData({ ...businessData, slug: e.target.value })}
                    placeholder="brew-bean-coffee"
                  />
                </div>
                <p className="text-xs text-gray-500">This will be your unique business URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={businessData.industry}
                  onValueChange={(value) => setBusinessData({ ...businessData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee_shop">Coffee Shop</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your business..."
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@yourbusiness.com"
                  value={businessData.email}
                  onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={businessData.phone}
                  onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={businessData.address}
                  onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={businessData.timezone}
                  onValueChange={(value) => setBusinessData({ ...businessData, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 3: Ready to Launch */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h3>
                <p className="text-gray-600 mb-4">
                  Your business <strong>{businessData.name}</strong> is ready to be created.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-orange-900">What happens next?</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>✅ Your business will be created with a 14-day free trial</li>
                  <li>✅ You'll be set as the business owner</li>
                  <li>✅ You can start creating shifts and inviting team members</li>
                  <li>✅ No credit card required during the trial</li>
                </ul>
              </div>

              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
                🎉 14-Day Free Trial Starts Now!
              </Badge>
            </div>
          )}
        </CardContent>

        {/* Navigation Buttons */}
        <div className="flex justify-between p-6 pt-0">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            disabled={!isStepValid() || isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : currentStep === 3 ? (
              <>
                Create Business
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
