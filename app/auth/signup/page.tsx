import type { Metadata } from "next"
import Link from "next/link"
import { SignUpForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Zap, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign Up - ShiftFlow",
  description: "Start your free 14-day trial with ShiftFlow",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ShiftFlow
            </span>
          </div>
        </div>

        {/* Trial Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            14-Day Free Trial
          </Badge>
        </div>

        {/* Sign Up Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Start Your Free Trial</CardTitle>
            <CardDescription className="text-gray-600">
              Join hundreds of coffee shops already using ShiftFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Benefits */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                No credit card required
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Full access to all features
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Cancel anytime
              </div>
            </div>

            <SignUpForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
