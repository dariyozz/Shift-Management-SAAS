import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const businessData = await request.json()
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Use a transaction-like approach with error handling
    let businessId: string

    // Step 1: Create business
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        name: businessData.name,
        slug: businessData.slug,
        description: businessData.description,
        industry: businessData.industry,
        address: businessData.address,
        phone: businessData.phone,
        email: businessData.email,
        timezone: businessData.timezone,
        settings: {
          positions:
            businessData.industry === "coffee_shop"
              ? ["barista", "cashier", "shift_lead", "manager"]
              : ["server", "cook", "host", "manager"],
          default_break_duration: 30,
        },
      })
      .select()
      .single()

    if (businessError) {
      console.error("Business creation error:", businessError)
      return NextResponse.json({ error: "Failed to create business: " + businessError.message }, { status: 400 })
    }

    businessId = business.id

    // Step 2: Create business member (owner)
    const { error: memberError } = await supabase.from("business_members").insert({
      business_id: businessId,
      user_id: user.id,
      role: "owner",
      hire_date: new Date().toISOString().split("T")[0],
      is_active: true,
    })

    if (memberError) {
      console.error("Member creation error:", memberError)
      // Try to clean up the business if member creation fails
      await supabase.from("businesses").delete().eq("id", businessId)
      return NextResponse.json(
        { error: "Failed to create business membership: " + memberError.message },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      business: business,
      message: "Business created successfully!",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
