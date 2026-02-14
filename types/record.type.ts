type TRecordUnit = {
  id: string
  key: string
  name: {
    en: string
    fr: string
  }
}

type TRecordSport = {
  id: string
  name: {
    en: string
    fr: string
  }
  iconName: string
  color: string
}

export type TRawRecord = {
  id: string
  name: string
  name_fr: string
  description: string | null
  category: string | null
  unit: { id: string; key: string; name_en: string; name_fr: string }
  sport?: {
    id: string
    name: string
    name_fr: string
    icon_name: string
    color: string
  }
  created_at: Date | null
}

export type TRecord = {
  id: string
  name: {
    en: string
    fr: string
  }
  description: string | null
  category: string | null
  unit: TRecordUnit
  sport?: TRecordSport
  createdAt?: Date | null
}

export type TRecordQuery = {
  name?: string
}

export type TInsertRecordPayload = {
  nameEn: string
  nameFr: string
  sportId: string
  unitId: string
  categories: string[]
  description?: string
  createdAt?: Date
}
