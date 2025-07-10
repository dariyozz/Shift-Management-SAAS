import { createClient } from "@/lib/supabase/server"

export default async function AuthDebugPage() {
  const supabase = await createClient()

  let sessionData = null
  let sessionError = null
  let userData = null
  let userError = null
  let businessMember = null
  let businessError = null

  try {
    // Get session
    const sessionResult = await supabase.auth.getSession()
    sessionData = sessionResult.data
    sessionError = sessionResult.error

    // Get user
    const userResult = await supabase.auth.getUser()
    userData = userResult.data
    userError = userResult.error

    // Get business member if user exists
    if (userData.user) {
      const businessResult = await supabase
        .from("business_members")
        .select("*, business:businesses(*)")
        .eq("user_id", userData.user.id)
        .eq("is_active", true)
        .maybeSingle()

      businessMember = businessResult.data
      businessError = businessResult.error
    }
  } catch (error) {
    console.error("Debug page error:", error)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Session Info:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {JSON.stringify({ session: sessionData?.session, error: sessionError }, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">User Info:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {JSON.stringify({ user: userData?.user, error: userError }, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Business Member:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">
            {JSON.stringify({ member: businessMember, error: businessError }, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Environment:</h2>
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
          <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
        </div>
      </div>
    </div>
  )
}
