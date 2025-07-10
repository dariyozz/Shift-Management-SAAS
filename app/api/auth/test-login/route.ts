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

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session ? "Session exists" : "No session",
    })
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
