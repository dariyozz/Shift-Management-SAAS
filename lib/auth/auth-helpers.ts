import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { UserProfile } from "@/lib/supabase/types"

export async function getUser() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getUser()
    if (!user) return null

    const supabase = await createClient()
    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Error in getUserProfile:", error)
    return null
  }
}

export async function requireBusinessMember(businessId?: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from("business_members")
    .select(`
      *,
      business:businesses(*),
      user_profile:user_profiles(*)
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)

  if (businessId) {
    query = query.eq("business_id", businessId)
  }

  const { data: member, error } = await query.maybeSingle()

  if (error || !member) {
    redirect("/onboarding")
  }

  return member
}

export async function checkSubscriptionStatus(businessId: string) {
  try {
    const supabase = await createClient()

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle()

    if (error || !subscription) {
      return null
    }

    // Check if trial has expired
    const now = new Date()
    const trialEnd = new Date(subscription.trial_end || "")

    const isTrialExpired = subscription.status === "trialing" && now > trialEnd
    const isActive = subscription.status === "active"
    const canAccess = isActive || !isTrialExpired

    return {
      ...subscription,
      isTrialExpired,
      canAccess,
      daysLeft: isTrialExpired ? 0 : Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    }
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return null
  }
}
