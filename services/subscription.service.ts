import { TUserSubscription } from "../types/subscription.type"
import { supabaseClient } from "../utilities/supabase/client.supabase"

export async function findUserActiveSubscription(
    userId: string
  ): Promise<TUserSubscription | null> {
    const { data: subscription, error } = await supabaseClient
      .from("subscriptions")
      .select(
        "id,userId:user_id,type:subscription_type,startDate:start_date,endDate:end_date,price,metadata"
      )
      .eq("user_id", userId)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .overrideTypes<TUserSubscription>()
  
    if (error) throw error
  
    return subscription
  }
  
  export async function fetchUsersActiveSubscription(
    userIds: string[]
  ): Promise<TUserSubscription[]> {
    const { data: subscriptions, error } = await supabaseClient
      .from("subscriptions")
      .select(
        "id,userId:user_id,type:subscription_type,startDate:start_date,endDate:end_date,price,metadata"
      )
      .in("user_id", userIds)
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString())
      .overrideTypes<TUserSubscription[]>()
  
    if (error) {
      console.error("failed to get user subscription ", error)
      return []
    }
  
    return subscriptions
  }
  