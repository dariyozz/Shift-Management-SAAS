import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Test database connection
    const { data: businesses, error: businessError } = await supabase.from("businesses").select("id, name").limit(1)

    if (businessError) {
      return NextResponse.json(
        {
          status: "❌ Database Error",
          error: businessError.message,
          suggestion: "Check if you've run the database setup scripts",
        },
        { status: 500 },
      )
    }

    // Test auth configuration
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    return NextResponse.json({
      status: "✅ Connection Successful",
      database: {
        connected: true,
        businessesFound: businesses?.length || 0,
      },
      auth: {
        configured: !authError,
        currentUser: user ? "User session found" : "No active session",
      },
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
      },
    })
  } catch (error) {
    console.error("Connection test error:", error)
    return NextResponse.json(
      {
        status: "❌ Connection Failed",
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Check your environment variables and Supabase project status",
      },
      { status: 500 },
    )
  }
}
