import { ROLE } from "../constants/role.constant"

export type TSubscriptionType = "monthly" | "yearly"
export type TSubscriptionStatus =
  | "active"
  | "canceled"
  | "expired"
  | "pending"
  | "trial"

export type TSubscriptionQuery = {
  title?: string
  role?: (typeof ROLE)[keyof typeof ROLE]
}

export type TSubscriptionPayload = {
  title: string
  description?: string
  monthlyPrice: number
  yearlyPrice: number
  role: (typeof ROLE)[keyof typeof ROLE]
  athleteCapacity?: "unlimited" | number
}

export type TSubscriptionPrice = {
  id: string
  period: TSubscriptionType
  price: number
}

export type TSubscriptionMetadata = {
  athleteCapacity?: string
  features?: string
  popular?: string
  role?: (typeof ROLE)[keyof typeof ROLE]
}

export type TSubscription = {
  id: string
  title: string
  description: string | null
  prices: TSubscriptionPrice[]
  metadata: TSubscriptionMetadata
}

export type TUserSubscription = {
  id: string
  userId: string
  type: string
  startDate: Date
  endDate: Date | null
  price: number
  metadata: {
    subscriptionId?: string
    priceId?: string
    product?: Record<string, any>
  } | null
}
