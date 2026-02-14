import { supabaseClient } from "../utilities/supabase/client.supabase"
import { getCurrentUser } from "./auth.service"

async function getCoachIdByInvitationCode(
  referralCode: string
): Promise<string | null> {
  const { data, error } = await supabaseClient
    .from("user_profiles")
    .select("id")
    .eq("invitation_code", referralCode)
    .eq("role", "coach")
    .maybeSingle()
    .overrideTypes<{ id: string }>()

  if (error) throw error

  return data?.id ?? null
}

async function isAthleteAlreadyConnectedToAnyCoaches(
  athleteId: string
): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from("user_profiles")
    .select("id")
    .eq("user_id", athleteId)
    .not("connected_at", "is", null)
    .eq("status", "accepted")
    .maybeSingle()

  if (error) throw error

  return data !== null
}

async function connectAthleteToCoach(
  athleteId: string,
  coachId: string
): Promise<void> {
  await supabaseClient
    .from("user_profiles")
    .insert({ coach_id: coachId, user_id: athleteId })
}

export async function submitReferralCode(referralCode: string) {
  const [athlete, coachId] = await Promise.all([
    getCurrentUser(),
    getCoachIdByInvitationCode(referralCode),
  ])

  if (!coachId) throw new Error("Invalid referral code")

  if (await isAthleteAlreadyConnectedToAnyCoaches(athlete.id))
    throw new Error("Athlete already connected to certain coach")

  await connectAthleteToCoach(athlete.id, coachId)
}
