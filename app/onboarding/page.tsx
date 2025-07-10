import { getUser } from "@/lib/auth/auth-helpers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default async function OnboardingPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Check if user already has a business
  const { data: existingMember, error } = await supabase
    .from("business_members")
    .select("*, business:businesses(*)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle() // Use maybeSingle instead of single to avoid errors when no rows found

  // If user already has a business, redirect to dashboard
  if (existingMember && !error) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <OnboardingWizard />
    </div>
  )
}
