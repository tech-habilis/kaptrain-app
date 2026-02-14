import { TCoach } from "../types/coach.type"
import { supabaseClient } from "../utilities/supabase/client.supabase"
import { getCurrentUser } from "./auth.service"

export async function getCoachData(): Promise<TCoach | null> {
  const athlete = await getCurrentUser()

  const { data: coachConnection } = await supabaseClient
    .from("coach_connections")
    .select("coachId:coach_id,connectedSince:connected_at")
    .eq("user_id", athlete.id)
    .not("connected_at", "is", null)
    .eq("status", "accepted")
    .limit(1)
    .maybeSingle()
    .overrideTypes<{ coachId: string; connectedSince: Date }>()
    .throwOnError()

  if (!coachConnection) return null

  const { data: coachProfile } = await supabaseClient
    .from("user_profiles")
    .select("id,name,profilePicture:avatar_url")
    .eq("id", coachConnection.coachId)
    .maybeSingle()
    .overrideTypes<{ id: string; name: string; profilePicture: string }>()
    .throwOnError()

  if (!coachProfile) return null

  return {
    id: coachProfile.id,
    profilePicture: coachProfile.profilePicture,
    name: coachProfile.name,
    connectedSince: coachConnection.connectedSince,
  }
}
