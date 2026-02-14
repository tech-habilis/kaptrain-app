import { Database } from "./database.types"
import { supabase } from "./index"

type UserProfileUpdate = Database["public"]["Tables"]["user_profiles"]["Update"]

/**
 * Updates the user's profile in the database
 */
export async function updateUserProfile(
  userId: string,
  updates: UserProfileUpdate
) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data
}

/**
 * Validates and accepts a coach invitation code
 * Links the athlete to a coach via the invitation code
 */
export async function acceptCoachInvitation(
  athleteId: string,
  invitationCode: string
) {
  // First, find the pending invitation with this code
  const { data: relationship, error: fetchError } = await supabase
    .from("athlete_coach_relationships")
    .select("*")
    .eq("invitation_code", invitationCode)
    .eq("status", "pending")
    .single()

  if (fetchError) {
    console.error("Error fetching invitation:", fetchError)
    throw new Error("Invalid or expired invitation code")
  }

  if (!relationship) {
    throw new Error("Invalid or expired invitation code")
  }

  // Check if this athlete is already the one linked
  if (relationship.athlete_id !== athleteId) {
    // The invitation was for a different athlete
    // We need to update it to link to this athlete instead
    const { data: updated, error: updateError } = await supabase
      .from("athlete_coach_relationships")
      .update({
        athlete_id: athleteId,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", relationship.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error accepting invitation:", updateError)
      throw updateError
    }

    return updated
  }

  // Accept the invitation
  const { data: updated, error: updateError } = await supabase
    .from("athlete_coach_relationships")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", relationship.id)
    .select()
    .single()

  if (updateError) {
    console.error("Error accepting invitation:", updateError)
    throw updateError
  }

  return updated
}

/**
 * Fetches the current user profile from the database
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }

  return data
}

/**
 * Checks if the user has already submitted wellness tracking for today.
 * Returns `true` if wellness form should be shown (no entry for today),
 * `false` if already submitted.
 */
export async function checkTodayWellnessNeeded(
  userId: string
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  const { data: pref, error: prefError } = await supabase
    .from("user_profiles")
    .select("preferences")
    .eq("id", userId)
    .maybeSingle()

  if (prefError) {
    console.error("Error fetching user preferences:", prefError)

    return false
  }

  const showWellness = pref?.preferences?.["autoWellnessTracking"] ?? true

  const { data, error } = await supabase
    .from("wellness_tracking")
    .select("id")
    .eq("user_id", userId)
    .eq("tracked_date", today)
    .maybeSingle()

  if (error) {
    console.error("Error checking today's wellness:", error)
    // If there's an error, don't block the user — skip wellness
    return false
  }

  // If no entry found for today, wellness is needed
  return showWellness && data === null
}
