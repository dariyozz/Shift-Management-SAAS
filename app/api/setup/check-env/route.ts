import { NextResponse } from "next/server"

export async function GET() {
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: {
      value: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      required: true,
      description: "Your Supabase project URL",
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      required: true,
      description: "Your Supabase anonymous/public key",
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      value: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      required: true,
      description: "Your Supabase service role key (for admin operations)",
    },
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
      value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",
      required: false,
      description: "Stripe publishable key (needed for billing)",
    },
    STRIPE_SECRET_KEY: {
      value: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
      required: false,
      description: "Stripe secret key (needed for billing)",
    },
  }

  const missingRequired = Object.entries(envCheck)
    .filter(([_, config]) => config.required && config.value.includes("❌"))
    .map(([key]) => key)

  return NextResponse.json({
    status: missingRequired.length === 0 ? "✅ All required variables set" : "❌ Missing required variables",
    environment: envCheck,
    missingRequired,
    instructions: {
      step1: "Copy .env.example to .env.local",
      step2: "Go to https://supabase.com/dashboard",
      step3: "Select your project or create a new one",
      step4: "Go to Settings > API",
      step5: "Copy the values to your .env.local file",
      step6: "Restart your development server",
    },
  })
}
