import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Create demo user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@brewbean.com',
      password: 'demo123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Demo User'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // Create business member for Brew & Bean Coffee
    const { data: memberData, error: memberError } = await supabase
      .from('business_members')
      .insert({
        business_id: '550e8400-e29b-41d4-a716-446655440001',
        user_id: userId,
        role: 'owner',
        hourly_rate: 25.00,
        hire_date: new Date().toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single()

    if (memberError) {
      console.error('Member error:', memberError)
      return NextResponse.json({ error: memberError.message }, { status: 400 })
    }

    // Assign some shifts to the demo user
    await supabase
      .from('shifts')
      .update({ 
        assigned_to: memberData.id,
        created_by: memberData.id 
      })
      .in('id', [
        '550e8400-e29b-41d4-a716-446655440301',
        '550e8400-e29b-41d4-a716-446655440302'
      ])

    return NextResponse.json({ 
      success: true, 
      message: 'Demo account created successfully!',
      credentials: {
        email: 'demo@brewbean.com',
        password: 'demo123456'
      }
    })

  } catch (error) {
    console.error('Demo creation error:', error)
    return NextResponse.json({ error: 'Failed to create demo account' }, { status: 500 })
  }
}
