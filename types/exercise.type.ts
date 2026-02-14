type TExerciseDifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "for_all"

export type TExercise = {
  id: string
  name: string
  language: string
  description: string
  theme: any
  sports: any[]
  materials: any[]
  primaryMuscle: string
  secondaryMuscle: string
  instructions?: Record<string, any>
  difficultyLevel?: TExerciseDifficultyLevel
  zones: string[]
  categories: string[]
  subCategories: string[]
  movementPatterns: string[]
  contractionTypes: string[]
  measurementTypes: string[]
  positions: string[]
  functionalities: string[]
  locations?: any[]
  videoThumbnailUrl?: string
  videoUrl?: string
  disabilityVideoUrl?: string
  isPublic?: boolean
  isFavorite?: boolean
}

export type TExerciseQuery = {
  keyword?: string
  isFavorite?: boolean
  sort?: "ASC" | "DESC"
  filters?: {
    themeIds?: string[]
    sportIds?: string[]
    materialIds?: string[]
    muscles?: string[]
  }
}
