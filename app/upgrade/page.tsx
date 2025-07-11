import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function UpgradePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Trial Ended</CardTitle>
            <CardDescription className="text-gray-600">
              Your 14-day free trial has ended. To continue using ShiftFlow, please upgrade your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Link href="#">Upgrade Now</Link>
            </Button>
            <div className="pt-2">
              <Link href="mailto:support@shiftflow.com" className="text-sm text-orange-600 hover:text-orange-500 transition-colors">
                Need help? Contact support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 