import { TRawRecord, TRecord } from "./record.type"

export type TRawSport = {
  id: string
  name: string
  name_fr: string
  keywords: string[]
  icon_name: string | null
  color: string | null
  description: string | null
  records?: TRawRecord[]
}

export type TSport = {
  id: string
  name: {
    en: string
    fr: string
  }
  keywords: string[]
  iconName: string | null
  color: string | null
  description: string | null
  records?: TRecord[]
}

export type TSportQuery = {
  name?: string
  withRecords?: boolean
}

export type TInsertSportPayload = {
  nameEn: string
  nameFr: string
  keywords: string[]
  iconName: string | null
  description?: string
  color?: string
}
