type TLastUpdatedAt = {
  lastUpdatedAt: Date | null
}

type THeartRate = {
  heartRateMax: {
    value: number
  } & TLastUpdatedAt
}

type TPace = {
  maxAerobicSpeed: {
    value: number
  } & TLastUpdatedAt
}

type TPower = {
  functionalThresholdPower: {
    value: number
  } & TLastUpdatedAt
  maxAerobicPower: {
    value: number
  } & TLastUpdatedAt
}

export type TUserPhysiological = {
  heartRate: THeartRate
  pace: TPace
  power: TPower
}

export type TSupabaseUserPhysiological = {
  heart_rate?: {
    heart_rate_max: {
      value: number
      updated_at: Date | null
    }
  }
  pace?: {
    max_aerobic_speed: {
      value: number
      updated_at: Date | null
    }
  }
  power?: {
    functional_threshold_power: {
      value: number
      updated_at: Date | null
    }
    max_aerobic_power: {
      value: number
      updated_at: Date | null
    }
  }
  created_at: Date | null
}

export type TPayloadStoreUserPhysiological = {
  heartRate?: {
    heartRateMax: {
      value: number
    }
  }
  pace?: {
    maxAerobicSpeed: {
      value: number
    }
  }
  power?: {
    functionalThresholdPower?: {
      value: number
    }
    maxAerobicPower?: {
      value: number
    }
  }
}
