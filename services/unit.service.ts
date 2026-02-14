import { supabaseClient } from "../utilities/supabase/client.supabase"

export async function fetchUnits() {
  const { data, error } = await supabaseClient.from("units").select("*")

  if (error) throw error

  return data
}
