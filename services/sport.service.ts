import { TRawRecord, TRecord } from "../types/record.type"
import {
  TInsertSportPayload,
  TRawSport,
  TSport,
  TSportQuery,
} from "../types/sport.type"
import { FileHandler } from "../utilities/file-handler"
import { transformKeysToSnakeCase } from "../utilities/object"
import { supabaseClient } from "../utilities/supabase/client.supabase"
import { getCurrentUser } from "./auth.service"

export async function updateAthleteSports(sportIds: string[]): Promise<void> {
  const [athlete, currentAthleteSports] = await Promise.all([
    getCurrentUser(),
    fetchAthleteSports(),
  ])

  const newlyAddedSportIds = sportIds.filter(
    (sportId) => !currentAthleteSports.some((sport) => sport.id === sportId)
  )

  if (newlyAddedSportIds.length)
    await supabaseClient
      .from("user_sports")
      .insert(
        newlyAddedSportIds.map((sportId) => ({
          user_id: athlete.id,
          sport_id: sportId,
        }))
      )
      .throwOnError()

  const removedSports = currentAthleteSports.filter(
    (sport) => !sportIds.includes(sport.id)
  )

  if (removedSports.length)
    await supabaseClient
      .from("user_sports")
      .delete()
      .in(
        "sport_id",
        removedSports.map((sport) => sport.id)
      )
      .eq("user_id", athlete.id)
      .throwOnError()
}

export async function fetchSports(query?: TSportQuery): Promise<TSport[]> {
  if (query?.withRecords) {
    return fetchSportsWithRecord(query)
  }

  const qb = supabaseClient
    .from("sports")
    .select("id, name, name_fr, keywords, icon_name, color, description")

  if (query?.name) {
    qb.or(`name.ilike.%${query.name}%, name_fr.ilike.%${query.name}%`)
  }

  const { data, error } = await qb
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  if (error) throw error

  const sports: TSport[] = data.map((sport: TRawSport) => ({
    id: sport.id,
    name: {
      en: sport.name,
      fr: sport.name_fr,
    },
    keywords: sport.keywords,
    iconName: sport.icon_name
      ? new FileHandler().readFile({ filePath: sport.icon_name })
      : null,
    color: sport.color,
    description: sport.description,
  }))

  return sports
}

export async function fetchAthleteSports(
  query?: TSportQuery
): Promise<TSport[]> {
  const athlete = await getCurrentUser()

  const { data: athleteSports } = await supabaseClient
    .from("user_sports")
    .select("sport_id")
    .eq("user_id", athlete.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .overrideTypes<{ sport_id: string }[]>()
    .throwOnError()

  if (!athleteSports) return []

  const qb = supabaseClient
    .from("sports")
    .select("id, name, name_fr, keywords, icon_name, color, description")
    .in(
      "id",
      athleteSports.map((sport) => sport.sport_id)
    )

  if (query?.name)
    qb.or(`name.ilike.%${query.name}%, name_fr.ilike.%${query.name}%`)

  const { data, error } = await qb
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })

  if (error) throw error

  let records: TRecord[] | undefined = undefined

  if (query?.withRecords) {
    const { data: recordsData } = await supabaseClient
      .from("records")
      .select(
        "id, name, name_fr, description, category, unit:units!unit_id (id, key, name_en, name_fr), created_at"
      )
      .in(
        "sport_id",
        data.map((sport) => sport.id)
      )
      .overrideTypes<TRawRecord[], { merge: false }>()
      .throwOnError()

    records = recordsData.map((record) => ({
      id: record.id,
      name: {
        en: record.name,
        fr: record.name_fr,
      },
      description: record.description,
      category: record.category,
      unit: {
        id: record.unit.id,
        key: record.unit.key,
        name: {
          en: record.unit.name_en,
          fr: record.unit.name_fr,
        },
      },
      createdAt: record.created_at,
    }))
  }

  const sports: TSport[] = data.map((sport: TRawSport) => ({
    id: sport.id,
    name: {
      en: sport.name,
      fr: sport.name_fr,
    },
    keywords: sport.keywords,
    iconName: sport.icon_name
      ? new FileHandler().readFile({ filePath: sport.icon_name })
      : null,
    color: sport.color,
    description: sport.description,
    records,
  }))

  return sports
}

export async function fetchSport(
  sportId: string,
  withRecords?: boolean
): Promise<TSport | null> {
  if (withRecords) {
    return fetchSportWithRecord(sportId)
  }

  const { data, error } = await supabaseClient
    .from("sports")
    .select("id, name, name_fr, keywords, icon_name, color, description")
    .eq("id", sportId)
    .single()

  if (error || !data) {
    if (error) throw error

    return null
  }

  return {
    id: data.id,
    name: {
      en: data.name,
      fr: data.name_fr,
    },
    keywords: data.keywords,
    iconName: data.icon_name,
    color: data.color,
    description: data.description,
  }
}

export async function insertSport(
  payload: TInsertSportPayload
): Promise<{ message: string; data: TSport | null }> {
  const { nameEn, ...rest } = payload
  const input = transformKeysToSnakeCase({
    ...rest,
    name: nameEn,
  })

  const { data, error } = await supabaseClient
    .from("sports")
    .insert(input)
    .select("id, name, name_fr, keywords, icon_name, color, description")
    .single()

  if (error) throw error

  const sport: TSport = {
    id: data.id,
    name: {
      en: data.name,
      fr: data.name_fr,
    },
    keywords: data.keywords,
    iconName: data.icon_name,
    color: data.color,
    description: data.description,
  }

  return {
    message: "insert sport successfully",
    data: sport,
  }
}

export async function updateSport(
  payload: Partial<TInsertSportPayload>,
  sportId: string
): Promise<{ message: string; data: TSport }> {
  const sport = await fetchSport(sportId)

  if (!sport) {
    throw new Error("failed to update sport caused data not found")
  }

  const { nameEn, nameFr, ...rest } = payload
  const sanitizedPayload: Omit<Partial<TInsertSportPayload>, "nameEn"> & {
    name?: string
  } = {
    ...rest,
  }

  if (
    nameEn !== undefined &&
    !(nameEn.toLowerCase() === sport.name.en.toLowerCase())
  ) {
    sanitizedPayload.name = nameEn
  }
  if (
    nameFr !== undefined &&
    !(nameFr.toLowerCase() === sport.name.fr.toLowerCase())
  ) {
    sanitizedPayload.nameFr = nameFr
  }

  const input = transformKeysToSnakeCase(sanitizedPayload)

  const { data, error } = await supabaseClient
    .from("sports")
    .update(input)
    .eq("id", sport.id)
    .select("id, name, name_fr, keywords, icon_name, color, description")
    .single()

  if (error) throw error

  return {
    message: "update sport successfully",
    data: {
      id: data.id,
      name: {
        en: data.name,
        fr: data.name_fr,
      },
      keywords: data.keywords,
      iconName: data.icon_name,
      color: data.color,
      description: data.description,
    },
  }
}

export async function deleteSport(
  sportId: string
): Promise<{ message: string }> {
  const sport = await fetchSport(sportId)

  if (!sport) {
    throw new Error("failed to delete sport caused data not found")
  }

  const { error } = await supabaseClient
    .from("sports")
    .delete()
    .eq("id", sport.id)

  if (error) throw error

  return {
    message: "delete sport successfully",
  }
}

async function fetchSportsWithRecord(
  query?: Omit<TSportQuery, "withRecords">
): Promise<TSport[]> {
  const args: any | undefined = {}

  if (query?.name) {
    args.p_search_name = query.name
  }

  const { data, error } = await supabaseClient.rpc(
    "fetch_sports_with_records",
    args
  )

  if (error) throw error

  const sports: TSport[] = data.map((sport: TRawSport) => ({
    id: sport.id,
    name: {
      en: sport.name,
      fr: sport.name_fr,
    },
    keywords: sport.keywords,
    iconName: sport.icon_name,
    color: sport.color,
    description: sport.description,
    records: sport.records?.length
      ? sport.records.map((record) => {
          return {
            id: record.id,
            name: {
              en: record.name,
              fr: record.name_fr,
            },
            category: record.category,
            unit: {
              id: record.unit.id,
              key: record.unit.key,
              name: {
                en: record.unit.name_en,
                fr: record.unit.name_fr,
              },
            },
            description: record.description,
          }
        })
      : [],
  }))

  return sports
}

async function fetchSportWithRecord(sportId: string): Promise<TSport | null> {
  const { data, error } = await supabaseClient
    .rpc("fetch_sport_with_records", { p_sport_id: sportId })
    .single()
    .overrideTypes<TRawSport>()

  if (error || !data) {
    if (error) throw error

    return null
  }

  return {
    id: data.id,
    name: {
      en: data.name,
      fr: data.name_fr,
    },
    keywords: data.keywords,
    iconName: data.icon_name,
    color: data.color,
    description: data.description,
    records: data.records?.length
      ? data.records.map((record) => {
          return {
            id: record.id,
            name: {
              en: record.name,
              fr: record.name_fr,
            },
            category: record.category,
            unit: {
              id: record.unit.id,
              key: record.unit.key,
              name: {
                en: record.unit.name_en,
                fr: record.unit.name_fr,
              },
            },
            description: record.description,
          }
        })
      : [],
  }
}
