"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coffee, ExternalLink, Copy, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface EnvStatus {
  status: string
  environment: Record<string, any>
  missingRequired: string[]
  instructions: Record<string, string>
}

export default function SetupPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkEnvironment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup/check-env")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Error checking environment:", error)
      toast.error("Failed to check environment variables")
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch("/api/test/connection")
      const data = await response.json()

      if (data.status.includes("✅")) {
        toast.success("Connection test successful!")
      } else {
        toast.error(`Connection test failed: ${data.error}`)
      }

      console.log("Connection test result:", data)
    } catch (error) {
      console.error("Connection test error:", error)
      toast.error("Failed to test connection")
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const envExampleContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here`

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShiftFlow Setup</h1>
          <p className="text-gray-600">Configure your environment variables to get started</p>
        </div>

        {/* Environment Status */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Environment Status
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : envStatus?.status.includes("✅") ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </CardTitle>
              <CardDescription>Current configuration status</CardDescription>
            </div>
            <Button onClick={checkEnvironment} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Checking environment variables...</p>
              </div>
            ) : envStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={envStatus.status.includes("✅") ? "default" : "destructive"}>
                    {envStatus.status}
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {Object.entries(envStatus.environment).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{key}</div>
                        <div className="text-xs text-gray-600">{config.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <Badge variant={config.value.includes("✅") ? "default" : "destructive"} className="text-xs">
                          {config.value}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {envStatus.missingRequired.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Missing required environment variables: {envStatus.missingRequired.join(", ")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Failed to load environment status</div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Step-by-step guide */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>Follow these steps to configure your environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Create .env.local file</p>
                    <p className="text-sm text-gray-600">Copy .env.example to .env.local in your project root</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Go to Supabase Dashboard</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 bg-transparent"
                      onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Supabase
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Create or select project</p>
                    <p className="text-sm text-gray-600">Create a new project or select an existing one</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Get API keys</p>
                    <p className="text-sm text-gray-600">Go to Settings → API and copy the keys</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <p className="font-medium">Update .env.local</p>
                    <p className="text-sm text-gray-600">Replace the placeholder values with your actual keys</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    6
                  </div>
                  <div>
                    <p className="font-medium">Restart dev server</p>
                    <p className="text-sm text-gray-600">Stop and restart your development server</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Environment Template
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(envExampleContent)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
              <CardDescription>Copy this template to your .env.local file</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                {envExampleContent}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Useful links and actions for setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Supabase Dashboard
              </Button>
              <Button variant="outline" onClick={testConnection}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button variant="outline" onClick={() => window.open("/debug/auth", "_blank")}>
                Debug Auth
              </Button>
              <Button variant="outline" onClick={() => window.open("/api/setup/check-env", "_blank")}>
                Check API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
