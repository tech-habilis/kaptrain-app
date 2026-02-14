import {
  TPayloadStoreUserPhysiological,
  TSupabaseUserPhysiological,
  TUserPhysiological,
} from "../types/user-physiological.type"
import { supabaseClient } from "../utilities/supabase/client.supabase"
import { getCurrentUser } from "./auth.service"

export async function getAthletePhysiologicalData(): Promise<TUserPhysiological | null> {
  const athlete = await getCurrentUser()

  const { data } = await supabaseClient
    .from("user_physiologicals")
    .select("heart_rate, pace, power")
    .eq("user_id", athlete.id)
    .maybeSingle()
    .overrideTypes<TSupabaseUserPhysiological>()
    .throwOnError()

  if (!data) return null

  return {
    heartRate: {
      heartRateMax: {
        value: data?.heart_rate?.heart_rate_max?.value ?? 0,
        lastUpdatedAt: data?.heart_rate?.heart_rate_max?.updated_at ?? null,
      },
    },
    pace: {
      maxAerobicSpeed: {
        value: data?.pace?.max_aerobic_speed?.value ?? 0,
        lastUpdatedAt: data?.pace?.max_aerobic_speed?.updated_at ?? null,
      },
    },
    power: {
      functionalThresholdPower: {
        value: data?.power?.functional_threshold_power?.value ?? 0,
        lastUpdatedAt:
          data?.power?.functional_threshold_power?.updated_at ?? null,
      },
      maxAerobicPower: {
        value: data?.power?.max_aerobic_power?.value ?? 0,
        lastUpdatedAt: data?.power?.max_aerobic_power?.updated_at ?? null,
      },
    },
  }
}

export async function storeOrUpdateAthletePhysiologicalData(
  data: TPayloadStoreUserPhysiological
): Promise<void> {
  const [athlete, physiological] = await Promise.all([
    getCurrentUser(),
    getAthletePhysiologicalData(),
  ])

  const payload = {
    ...(data.heartRate && {
      heart_rate: {
        heart_rate_max: {
          value: data.heartRate.heartRateMax.value,
          updated_at: new Date(),
        },
      },
    }),
    ...(data.pace && {
      pace: {
        max_aerobic_speed: {
          value: data.pace.maxAerobicSpeed.value,
          updated_at: new Date(),
        },
      },
    }),
    ...(data.power && {
      power: {
        functional_threshold_power: {
          value: data.power.functionalThresholdPower?.value ?? 0,
          updated_at: new Date(),
        },
        max_aerobic_power: {
          value: data.power.maxAerobicPower?.value ?? 0,
          updated_at: new Date(),
        },
      },
    }),
  }

  if (physiological) {
    await supabaseClient
      .from("user_physiologicals")
      .update(payload)
      .eq("user_id", athlete.id)
      .throwOnError()
  } else {
    await supabaseClient
      .from("user_physiologicals")
      .insert({
        ...payload,
        user_id: athlete.id,
        created_at: new Date().toISOString(),
      })
      .throwOnError()
  }
}
