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
 * Fetches the current user profile from the database.
 * Returns null if no profile exists for the user.
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

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

  const showWellness: boolean =
    (typeof pref?.preferences === "object" &&
    pref?.preferences !== null &&
    "autoWellnessTracking" in pref.preferences
      ? (pref.preferences["autoWellnessTracking"] as boolean)
      : true) ?? true

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

export async function updateUserPreferences(
  userId: string,
  preferences: Record<string, any>
) {
  // Fetch current preferences
  const { data: currentData, error: fetchError } = await supabase
    .from("user_profiles")
    .select("preferences")
    .eq("id", userId)
    .single()

  if (fetchError) {
    console.error("Error fetching user preferences:", fetchError)
    throw fetchError
  }

  // Merge: existing preferences + new preferences
  const mergedPreferences = {
    ...(typeof currentData?.preferences === "object" &&
    currentData?.preferences !== null
      ? currentData.preferences
      : {}),
    ...preferences,
  }

  // Update with merged data
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ preferences: mergedPreferences })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user preferences:", error)
    throw error
  }

  return data
}
