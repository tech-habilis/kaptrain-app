import {
  TInsertRecordPayload,
  TRawRecord,
  TRecord,
  TRecordQuery,
} from "../types/record.type"
import { transformKeysToSnakeCase } from "../utilities/object"
import { supabaseClient } from "../utilities/supabase/client.supabase"

export async function fetchRecords(query?: TRecordQuery) {
  const qb = supabaseClient.from("records").select(
    `
        id, name, name_fr, description, category, 
        unit:units!unit_id (id, key, name_en, name_fr),
        sport:sports!sport_id (id, name, name_fr, icon_name, color)
        `
  )

  if (query?.name) {
    qb.or(`name.ilike.%${query.name}%, name_fr.ilike.%${query.name}%`)
  }

  const { data, error } = await qb
    .order("created_at", { ascending: false })
    .overrideTypes<TRawRecord[], { merge: false }>()

  if (error) throw error

  const records: TRecord[] = data.map((record: TRawRecord) => ({
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
    sport: record.sport
      ? {
          id: record.sport.id,
          name: {
            en: record.sport.name,
            fr: record.sport.name_fr,
          },
          iconName: record.sport.icon_name,
          color: record.sport.color,
        }
      : undefined,
  }))

  return records
}

export async function fetchRecord(recordId: string): Promise<TRecord | null> {
  const { data, error } = await supabaseClient
    .from("records")
    .select(
      `
        id, name, name_fr, description, category, 
        unit:units!unit_id (id, key, name_en, name_fr),
        sport:sports!sport_id (id, name, name_fr, icon_name, color)
        `
    )
    .eq("id", recordId)
    .single()
    .overrideTypes<TRawRecord, { merge: false }>()

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
    description: data.description,
    category: data.category,
    unit: {
      id: data.unit.id,
      key: data.unit.key,
      name: {
        en: data.unit.name_en,
        fr: data.unit.name_fr,
      },
    },
    sport: data.sport
      ? {
          id: data.sport.id,
          name: {
            en: data.sport.name,
            fr: data.sport.name_fr,
          },
          iconName: data.sport.icon_name,
          color: data.sport.color,
        }
      : undefined,
  }
}

export async function insertRecord(
  payload: TInsertRecordPayload
): Promise<{ message: string; data: TRecord[] }> {
  const { nameEn, categories, createdAt, ...rest } = payload

  const inputs = categories.map((category) => {
    return transformKeysToSnakeCase({
      ...rest,
      name: nameEn,
      category,
      created_at: createdAt,
    })
  })

  const { data, error } = await supabaseClient
    .from("records")
    .insert(inputs)
    .select(
      `
        id, name, name_fr, description, category, 
        unit:units!unit_id (id, key, name_en, name_fr),
        sport:sports!sport_id (id, name, name_fr, icon_name, color),
        created_at
        `
    )
    .overrideTypes<TRawRecord[], { merge: false }>()

  if (error) throw error

  const records: TRecord[] = data.map((record) => ({
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
    sport: record.sport
      ? {
          id: record.sport.id,
          name: {
            en: record.sport.name,
            fr: record.sport.name_fr,
          },
          iconName: record.sport.icon_name,
          color: record.sport.color,
        }
      : undefined,
    createdAt: record.created_at,
  }))

  return {
    message: "insert record successfully",
    data: records,
  }
}

export async function updateRecord(
  recordId: string,
  payload: Partial<TInsertRecordPayload>
): Promise<{ message: string; data: TRecord[] }> {
  const record = await fetchRecord(recordId)

  if (!record) {
    return {
      message: "failed to update record caused data not found",
      data: [],
    }
  }

  const { data: relatedRecords, error: relatedError } = await supabaseClient
    .from("records")
    .select(
      `
        id, name, name_fr, description, category, sport_id, unit_id,
        unit:units!unit_id (id, key, name_en, name_fr),
        sport:sports!sport_id (id, name, name_fr, icon_name, color)
        created_at
        `
    )
    .or(`name.eq.${record.name.en},name_fr.eq.${record.name.fr}`)
    .eq("sport_id", record.sport?.id)
    .eq("unit_id", record.unit.id)
    .overrideTypes<TRawRecord[], { merge: false }>()

  if (relatedError) throw relatedError

  const { categories, nameEn, nameFr, createdAt, ...rest } = payload

  const existingCategories = relatedRecords
    .map((r) => r.category)
    .filter((c): c is string => c !== null)

  const newCategories = categories ?? existingCategories

  const toKeep = existingCategories.filter((c) => newCategories.includes(c))
  const toCreate = newCategories.filter((c) => !existingCategories.includes(c))

  if (toKeep.length > 0) {
    const idsToUpdate = relatedRecords
      .filter((r) => r.category && toKeep.includes(r.category))
      .map((r) => r.id)

    if (idsToUpdate.length > 0) {
      const sanitizedPayload: Omit<
        Partial<TInsertRecordPayload>,
        "nameEn" | "categories"
      > & {
        name?: string
      } = {
        ...rest,
        ...(createdAt && { created_at: createdAt }),
      }

      if (
        nameEn !== undefined &&
        !(nameEn.toLowerCase() === record.name.en.toLowerCase())
      ) {
        sanitizedPayload.name = nameEn
      }
      if (
        nameFr !== undefined &&
        !(nameFr.toLowerCase() === record.name.fr.toLowerCase())
      ) {
        sanitizedPayload.nameFr = nameFr
      }

      const input = transformKeysToSnakeCase(sanitizedPayload)

      const { error: updateError } = await supabaseClient
        .from("records")
        .update(input)
        .in("id", idsToUpdate)

      if (updateError) throw updateError
    }
  }

  if (toCreate.length > 0) {
    const insertInputs = toCreate.map((category) => ({
      name: nameEn ?? record.name.en,
      name_fr: nameFr ?? record.name.fr,
      sport_id: rest.sportId ?? record.sport?.id,
      unit_id: rest.unitId ?? record.unit?.id,
      description: rest.description ?? record.description,
      category,
      created_at: createdAt ?? new Date().toISOString(),
    }))

    const { error: insertError } = await supabaseClient
      .from("records")
      .insert(insertInputs)

    if (insertError) throw insertError
  }

  const { data: finalRecords, error: finalError } = await supabaseClient
    .from("records")
    .select(
      `
        id, name, name_fr, description, category, 
        unit:units!unit_id (id, key, name_en, name_fr),
        sport:sports!sport_id (id, name, name_fr, icon_name, color)
        created_at
        `
    )
    .or(`name.eq.${nameEn},name_fr.eq.${nameFr}`)
    .eq("sport_id", rest.sportId)
    .eq("unit_id", rest.unitId)
    .overrideTypes<TRawRecord[], { merge: false }>()

  if (finalError) throw finalError

  const records: TRecord[] = finalRecords.map((record) => ({
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
    sport: record.sport
      ? {
          id: record.sport.id,
          name: {
            en: record.sport.name,
            fr: record.sport.name_fr,
          },
          iconName: record.sport.icon_name,
          color: record.sport.color,
        }
      : undefined,
    createdAt: record.created_at,
  }))

  return {
    message: "update record successfully",
    data: records,
  }
}

export async function deleteRecord(
  recordId: string
): Promise<{ message: string }> {
  const record = await fetchRecord(recordId)

  if (!record) {
    throw new Error("failed to delete record caused data not found")
  }

  const { error } = await supabaseClient
    .from("records")
    .delete()
    .eq("id", record.id)

  if (error) throw error

  return {
    message: "delete record successfully",
  }
}
