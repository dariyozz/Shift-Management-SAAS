import { getUser } from "@/lib/auth/auth-helpers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  // Check authentication first
  const user = await getUser()

  if (!user) {
    console.log("No user found, redirecting to login")
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Get business member
  const { data: member, error: memberError } = await supabase
    .from("business_members")
    .select(`
      *,
      business:businesses(*),
      user_profile:user_profiles(*)
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle()

  if (memberError) {
    console.error("Error fetching business member:", memberError)
    redirect("/onboarding")
  }

  if (!member) {
    console.log("No business member found, redirecting to onboarding")
    redirect("/onboarding")
  }

  // Get subscription status
  const subscription = await checkSubscriptionStatus(member.business_id)

  // Get recent shifts
  const { data: recentShifts } = await supabase
    .from("shifts")
    .select(`
      *,
      assigned_to:business_members(
        id,
        user_profile:user_profiles(full_name)
      )
    `)
    .eq("business_id", member.business_id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(5)

  // Get team members count
  const { count: teamCount } = await supabase
    .from("business_members")
    .select("*", { count: "exact" })
    .eq("business_id", member.business_id)
    .eq("is_active", true)

  return (
    <DashboardLayout member={member} subscription={subscription}>
      <DashboardOverview
        member={member}
        subscription={subscription}
        recentShifts={recentShifts || []}
        teamCount={teamCount || 0}
      />
    </DashboardLayout>
  )
}

async function checkSubscriptionStatus(businessId: string) {
  try {
    const supabase = await createClient()

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("business_id", businessId)
      .single()

    if (error) {
      console.error("Error fetching subscription:", error)
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
