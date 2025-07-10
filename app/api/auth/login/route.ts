import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const supabase = await createRouteHandlerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create response with redirect
    const response = NextResponse.json({
      success: true,
      redirectTo: "/dashboard",
    })

    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
