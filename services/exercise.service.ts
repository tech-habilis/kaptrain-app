import { TExercise, TExerciseQuery } from "../types/exercise.type"
import { supabaseClient } from "../utilities/supabase/client.supabase"
import { getCurrentUser } from "./auth.service"

export async function fetchExercises(
  query?: TExerciseQuery
): Promise<TExercise[]> {
  const user = await getCurrentUser()

  const qb = supabaseClient.from("exercises").select(
    `
      id, name, language, description, primary_muscle, secondary_muscle, 
      theme:themes!theme_id (id, key, name_fr, name_en, sort_order),
      exercise_sports!inner (
        sport:sports (id, name, name_fr, icon_name, color, description, keywords)
      ),
      exercise_materials!inner (
        material:materials (id, name, name_fr, icon_name, color, description)
      ),
      exercise_locations!inner (
        location:locations (id, key, name_en, name_fr, icon_name, sort_order)
      ),
      zones, categories, sub_categories, movement_patterns, contraction_types, measurement_types, positions, functionalities, video_thumbnail_url, video_url, disability_video_url, is_public, 
      user_favorite_exercises!left(user_id)
      `
  )

  if (query?.keyword) {
    qb.ilike("name", `%${query.keyword}%`)
  }

  const filters = query?.filters

  if (filters?.themeIds?.length) {
    qb.in("theme_id", filters.themeIds)
  }

  if (filters?.sportIds?.length) {
    qb.in("exercise_sports.sport_id", filters.sportIds)
  }

  if (filters?.materialIds?.length) {
    qb.in("exercise_materials.material_id", filters.materialIds)
  }

  if (filters?.muscles?.length) {
    const muscleFilter = filters.muscles.map((m) => `"${m}"`).join(",")

    qb.or(
      `primary_muscle.in.(${muscleFilter}),secondary_muscle.in.(${muscleFilter})`
    )
  }

  qb.eq("user_favorite_exercises.user_id", user.id)

  const sortColumn = query?.sort ? "name" : "created_at"
  const ascending = query?.sort ? query.sort === "ASC" : false

  const { data, error } = await qb.order(sortColumn, { ascending })

  if (error) throw error

  const exercises = data.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      language: item.language,
      description: item.description,
      theme: item.theme,
      sports: item.exercise_sports?.map((data: any) => data.sport) ?? [],
      materials:
        item.exercise_materials?.map((data: any) => data.material) ?? [],
      primaryMuscle: item.primary_muscle,
      secondaryMuscle: item.secondary_muscle,
      zones: item.zones,
      categories: item.categories,
      subCategories: item.sub_categories,
      movementPatterns: item.movement_patterns,
      contractionTypes: item.contraction_types,
      measurementTypes: item.measurement_types,
      positions: item.positions,
      functionalities: item.functionalities,
      videoUrl: item.video_url,
      disabilityVideoUrl: item.disability_video_url,
      isPublic: item.is_public,
      isFavorite: (item.user_favorite_exercises?.length ?? 0) > 0,
      videoThumbnailUrl: item.video_thumbnail_url,
    }
  })

  if (query?.isFavorite) {
    return exercises.filter((e: TExercise) => e.isFavorite)
  }

  return exercises
}

export async function fetchExercise(
  exerciseId: string
): Promise<TExercise | null> {
  const user = await getCurrentUser()

  const { data, error } = await supabaseClient
    .from("exercises")
    .select(
      `
      id, name, language, description, primary_muscle, secondary_muscle, 
      theme:themes!theme_id (id, key, name_fr, name_en, sort_order),
      exercise_sports (
        sport:sports (id, name, name_fr, icon_name, color, description, keywords)
      ),
      exercise_materials (
        material:materials (id, name, name_fr, icon_name, color, description)
      ),
      instructions, difficulty_level, zones, categories, sub_categories, movement_patterns, contraction_types, measurement_types, positions, functionalities,
      exercise_locations (
        location:locations (id, key, name_en, name_fr, icon_name, sort_order)
      ),
      video_thumbnail_url, video_url, disability_video_url, is_public,
      user_favorite_exercises!left(user_id)
    `
    )
    .eq("id", exerciseId)
    .eq("user_favorite_exercises.user_id", user.id)
    .single()

  if (error || !data) {
    if (error) throw error

    return null
  }

  return {
    id: data.id,
    name: data.name,
    language: data.language,
    description: data.description,
    theme: data.theme,
    sports: data.exercise_sports.map((data: any) => data.sport),
    materials: data.exercise_materials.map((data: any) => data.material),
    primaryMuscle: data.primary_muscle,
    secondaryMuscle: data.secondary_muscle,
    instructions: data.instructions,
    difficultyLevel: data.difficulty_level,
    zones: data.zones,
    categories: data.categories,
    subCategories: data.sub_categories,
    movementPatterns: data.movement_patterns,
    contractionTypes: data.contraction_types,
    measurementTypes: data.measurement_types,
    positions: data.positions,
    functionalities: data.functionalities,
    locations: data.exercise_locations.map((data: any) => data.location),
    videoUrl: data.video_url,
    disabilityVideoUrl: data.disability_video_url,
    isPublic: data.is_public,
    isFavorite: (data.user_favorite_exercises?.length ?? 0) > 0,
    videoThumbnailUrl: data.video_thumbnail_url,
  }
}

export async function attachUserFavoriteExercise(
  userId: string,
  exerciseId: string
) {
  const supabase = supabaseClient

  const { error } = await supabase.from("user_favorite_exercises").upsert(
    {
      user_id: userId,
      exercise_id: exerciseId,
    },
    { onConflict: "user_id,exercise_id", ignoreDuplicates: true }
  )

  if (error) throw error

  return { message: "Favorite exercise updated successfully" }
}

export async function detachUserFavoriteExercise(
  userId: string,
  exerciseId: string
) {
  const supabase = supabaseClient

  const { error } = await supabase
    .from("user_favorite_exercises")
    .delete()
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId)

  if (error) throw error

  return { message: "Favorite exercise removed successfully" }
}
