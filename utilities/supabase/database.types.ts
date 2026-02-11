export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      coach_connections: {
        Row: {
          coach_id: string
          connected_at: string | null
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["connection_status"] | null
          user_id: string
        }
        Insert: {
          coach_id: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["connection_status"] | null
          user_id: string
        }
        Update: {
          coach_id?: string
          connected_at?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["connection_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_connections_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_locations: {
        Row: {
          exercise_id: string
          location_id: string
        }
        Insert: {
          exercise_id: string
          location_id: string
        }
        Update: {
          exercise_id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_locations_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_materials: {
        Row: {
          exercise_id: string
          material_id: string
        }
        Insert: {
          exercise_id: string
          material_id: string
        }
        Update: {
          exercise_id?: string
          material_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_materials_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_materials_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_primary_muscles: {
        Row: {
          exercise_id: string
          muscle_id: string
        }
        Insert: {
          exercise_id: string
          muscle_id: string
        }
        Update: {
          exercise_id?: string
          muscle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_primary_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_primary_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_secondary_muscles: {
        Row: {
          exercise_id: string
          muscle_id: string
        }
        Insert: {
          exercise_id: string
          muscle_id: string
        }
        Update: {
          exercise_id?: string
          muscle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_secondary_muscles_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_secondary_muscles_muscle_id_fkey"
            columns: ["muscle_id"]
            isOneToOne: false
            referencedRelation: "muscles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sports: {
        Row: {
          exercise_id: string
          sport_id: string
        }
        Insert: {
          exercise_id: string
          sport_id: string
        }
        Update: {
          exercise_id?: string
          sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sports_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_sports_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          categories: string[] | null
          contraction_types: string[] | null
          created_at: string | null
          created_by: string | null
          default_duration_seconds: number | null
          default_reps: number | null
          default_rest_seconds: number | null
          default_sets: number | null
          description: string | null
          difficulty_level: string | null
          disability_video_url: string | null
          functionalities: string[] | null
          id: string
          instructions: Json | null
          is_active: boolean | null
          is_public: boolean | null
          language: string
          measurement_types: string[] | null
          movement_patterns: string[] | null
          name: string
          positions: string[] | null
          sub_categories: string[] | null
          theme_id: string | null
          updated_at: string | null
          video_thumbnail_url: string | null
          video_url: string | null
          zones: string[] | null
        }
        Insert: {
          categories?: string[] | null
          contraction_types?: string[] | null
          created_at?: string | null
          created_by?: string | null
          default_duration_seconds?: number | null
          default_reps?: number | null
          default_rest_seconds?: number | null
          default_sets?: number | null
          description?: string | null
          difficulty_level?: string | null
          disability_video_url?: string | null
          functionalities?: string[] | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          is_public?: boolean | null
          language: string
          measurement_types?: string[] | null
          movement_patterns?: string[] | null
          name: string
          positions?: string[] | null
          sub_categories?: string[] | null
          theme_id?: string | null
          updated_at?: string | null
          video_thumbnail_url?: string | null
          video_url?: string | null
          zones?: string[] | null
        }
        Update: {
          categories?: string[] | null
          contraction_types?: string[] | null
          created_at?: string | null
          created_by?: string | null
          default_duration_seconds?: number | null
          default_reps?: number | null
          default_rest_seconds?: number | null
          default_sets?: number | null
          description?: string | null
          difficulty_level?: string | null
          disability_video_url?: string | null
          functionalities?: string[] | null
          id?: string
          instructions?: Json | null
          is_active?: boolean | null
          is_public?: boolean | null
          language?: string
          measurement_types?: string[] | null
          movement_patterns?: string[] | null
          name?: string
          positions?: string[] | null
          sub_categories?: string[] | null
          theme_id?: string | null
          updated_at?: string | null
          video_thumbnail_url?: string | null
          video_url?: string | null
          zones?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      injuries: {
        Row: {
          body_part: string | null
          created_at: string | null
          description: string | null
          id: string
          injury_date: string
          recovery_date: string | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["injury_severity"] | null
          status: Database["public"]["Enums"]["injury_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body_part?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          injury_date: string
          recovery_date?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["injury_severity"] | null
          status?: Database["public"]["Enums"]["injury_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body_part?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          injury_date?: string
          recovery_date?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["injury_severity"] | null
          status?: Database["public"]["Enums"]["injury_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "injuries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      intensity_references: {
        Row: {
          id: string
          is_active: boolean | null
          name_en: string | null
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          id: string
          is_active?: boolean | null
          name_en?: string | null
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          name_en?: string | null
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          key: string
          name_en: string
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          name_en: string
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          name_en?: string
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_custom: boolean | null
          name: string
          name_fr: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          name: string
          name_fr: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          name?: string
          name_fr?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          coach_connection_id: string
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          coach_connection_id: string
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          coach_connection_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_coach_connection_id_fkey"
            columns: ["coach_connection_id"]
            isOneToOne: false
            referencedRelation: "coach_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      muscles: {
        Row: {
          body_zone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          name_en: string
          name_fr: string
          sort_order: number | null
          svg_path_id: string | null
        }
        Insert: {
          body_zone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          name_en: string
          name_fr: string
          sort_order?: number | null
          svg_path_id?: string | null
        }
        Update: {
          body_zone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          name_en?: string
          name_fr?: string
          sort_order?: number | null
          svg_path_id?: string | null
        }
        Relationships: []
      }
      physiological_data: {
        Row: {
          created_at: string | null
          id: string
          measured_at: string
          metric_type: Database["public"]["Enums"]["physiological_metric"]
          notes: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          measured_at: string
          metric_type: Database["public"]["Enums"]["physiological_metric"]
          notes?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          measured_at?: string
          metric_type?: Database["public"]["Enums"]["physiological_metric"]
          notes?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "physiological_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_enrollments: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          end_date: string | null
          enrolled_at: string | null
          id: string
          is_active: boolean | null
          program_id: string
          start_date: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          end_date?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          program_id: string
          start_date: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          end_date?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          program_id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          created_by: string
          description: string | null
          difficulty_level: string | null
          duration_weeks: number | null
          enrollment_count: number | null
          id: string
          is_active: boolean | null
          is_published: boolean | null
          price: number | null
          program_type: Database["public"]["Enums"]["program_type"]
          sport_id: string | null
          title: string
          updated_at: string | null
          workouts_per_day: number
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          enrollment_count?: number | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          price?: number | null
          program_type: Database["public"]["Enums"]["program_type"]
          sport_id?: string | null
          title: string
          updated_at?: string | null
          workouts_per_day: number
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          duration_weeks?: number | null
          enrollment_count?: number | null
          id?: string
          is_active?: boolean | null
          is_published?: boolean | null
          price?: number | null
          program_type?: Database["public"]["Enums"]["program_type"]
          sport_id?: string | null
          title?: string
          updated_at?: string | null
          workouts_per_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      records: {
        Row: {
          categories: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          name_fr: string
          sport_id: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_fr: string
          sport_id: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_fr?: string
          sport_id?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "records_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      session_block_exercises: {
        Row: {
          id: string
          is_completed: boolean | null
          sequence_order: number
          session_block_id: string
          training_block_exercise_id: string
        }
        Insert: {
          id?: string
          is_completed?: boolean | null
          sequence_order: number
          session_block_id: string
          training_block_exercise_id: string
        }
        Update: {
          id?: string
          is_completed?: boolean | null
          sequence_order?: number
          session_block_id?: string
          training_block_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_block_exercises_session_block_id_fkey"
            columns: ["session_block_id"]
            isOneToOne: false
            referencedRelation: "session_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_block_exercises_training_block_exercise_id_fkey"
            columns: ["training_block_exercise_id"]
            isOneToOne: false
            referencedRelation: "training_block_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      session_blocks: {
        Row: {
          id: string
          intensity_id: string | null
          sequence_order: number
          session_id: string
          training_block_id: string
        }
        Insert: {
          id?: string
          intensity_id?: string | null
          sequence_order: number
          session_id: string
          training_block_id: string
        }
        Update: {
          id?: string
          intensity_id?: string | null
          sequence_order?: number
          session_id?: string
          training_block_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_blocks_intensity_id_fkey"
            columns: ["intensity_id"]
            isOneToOne: false
            referencedRelation: "intensity_references"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_blocks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_blocks_training_block_id_fkey"
            columns: ["training_block_id"]
            isOneToOne: false
            referencedRelation: "training_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          note_type: string
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          note_type: string
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          note_type?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_timer_configs: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          id: string
          rest_seconds: number | null
          rounds: number | null
          session_id: string
          timer_type: Database["public"]["Enums"]["timer_type"]
          work_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          rest_seconds?: number | null
          rounds?: number | null
          session_id: string
          timer_type: Database["public"]["Enums"]["timer_type"]
          work_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          rest_seconds?: number | null
          rounds?: number | null
          session_id?: string
          timer_type?: Database["public"]["Enums"]["timer_type"]
          work_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_timer_configs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          activity_color: string | null
          coach_id: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          program_enrollment_id: string | null
          program_id: string | null
          published_at: string | null
          rpe_rating: number | null
          scheduled_date: string
          scheduled_time: string | null
          session_status: Database["public"]["Enums"]["session_status"] | null
          session_type: Database["public"]["Enums"]["session_type"]
          sport_ids: string[] | null
          theme_ids: string[] | null
          title: string
          updated_at: string | null
          user_feedback: string | null
        }
        Insert: {
          activity_color?: string | null
          coach_id: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          program_enrollment_id?: string | null
          program_id?: string | null
          published_at?: string | null
          rpe_rating?: number | null
          scheduled_date: string
          scheduled_time?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          session_type: Database["public"]["Enums"]["session_type"]
          sport_ids?: string[] | null
          theme_ids?: string[] | null
          title: string
          updated_at?: string | null
          user_feedback?: string | null
        }
        Update: {
          activity_color?: string | null
          coach_id?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          program_enrollment_id?: string | null
          program_id?: string | null
          published_at?: string | null
          rpe_rating?: number | null
          scheduled_date?: string
          scheduled_time?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          session_type?: Database["public"]["Enums"]["session_type"]
          sport_ids?: string[] | null
          theme_ids?: string[] | null
          title?: string
          updated_at?: string | null
          user_feedback?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_program_enrollment_id_fkey"
            columns: ["program_enrollment_id"]
            isOneToOne: false
            referencedRelation: "program_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      sport_objectives: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          objective_category: Database["public"]["Enums"]["objective_category"]
          progress_percentage: number | null
          sport_id: string
          status: Database["public"]["Enums"]["objective_status"] | null
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          objective_category: Database["public"]["Enums"]["objective_category"]
          progress_percentage?: number | null
          sport_id: string
          status?: Database["public"]["Enums"]["objective_status"] | null
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          objective_category?: Database["public"]["Enums"]["objective_category"]
          progress_percentage?: number | null
          sport_id?: string
          status?: Database["public"]["Enums"]["objective_status"] | null
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sport_objectives_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sport_objectives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_custom: boolean | null
          keywords: string[] | null
          name: string
          name_fr: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          keywords?: string[] | null
          name: string
          name_fr: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_custom?: boolean | null
          keywords?: string[] | null
          name?: string
          name_fr?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          currency: string | null
          end_date: string | null
          id: string
          price: number
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          price: number
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          currency?: string | null
          end_date?: string | null
          id?: string
          price?: number
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      successes: {
        Row: {
          badge: string | null
          created_at: string | null
          created_by: string
          description: string | null
          experience_total: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          experience_total: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          experience_total?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "successes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          name_en: string | null
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          name_en?: string | null
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          name_en?: string | null
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      training_block_exercises: {
        Row: {
          description: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_library_id: string | null
          id: string
          name: string
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          training_block_id: string
          weight_kg: number | null
        }
        Insert: {
          description?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_library_id?: string | null
          id?: string
          name: string
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          training_block_id: string
          weight_kg?: number | null
        }
        Update: {
          description?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_library_id?: string | null
          id?: string
          name?: string
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          training_block_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_block_exercises_training_block_id_fkey"
            columns: ["training_block_id"]
            isOneToOne: false
            referencedRelation: "training_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      training_blocks: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_blocks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          name_en: string | null
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          name_en?: string | null
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          name_en?: string | null
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          deleted_at: string | null
          display_name: string | null
          email: string
          first_name: string | null
          gender: string | null
          height: number | null
          id: string
          in_wheelchair: boolean | null
          invitation_code: string | null
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          name: string | null
          onboarding_date: string | null
          payment_gateway_id: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          sport_level: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email: string
          first_name?: string | null
          gender?: string | null
          height?: number | null
          id: string
          in_wheelchair?: boolean | null
          invitation_code?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          name?: string | null
          onboarding_date?: string | null
          payment_gateway_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sport_level?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          first_name?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          in_wheelchair?: boolean | null
          invitation_code?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          name?: string | null
          onboarding_date?: string | null
          payment_gateway_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          sport_level?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      user_sports: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          sport_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          sport_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          sport_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sports_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_sports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_tracking: {
        Row: {
          created_at: string | null
          energy_level: number | null
          hydration_score: number | null
          id: string
          mood_level: number | null
          muscle_soreness: number | null
          notes: string | null
          nutrition_score: number | null
          sleep_quality: number | null
          stress_level: number | null
          tracked_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          hydration_score?: number | null
          id?: string
          mood_level?: number | null
          muscle_soreness?: number | null
          notes?: string | null
          nutrition_score?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          tracked_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          hydration_score?: number | null
          id?: string
          mood_level?: number | null
          muscle_soreness?: number | null
          notes?: string | null
          nutrition_score?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          tracked_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_sport_with_records: {
        Args: { p_sport_id: string }
        Returns: {
          color: string
          description: string
          icon_name: string
          id: string
          keywords: string[]
          name: string
          name_fr: string
          records: Json
        }[]
      }
      fetch_sports_with_records: {
        Args: { p_search_name?: string }
        Returns: {
          color: string
          description: string
          icon_name: string
          id: string
          keywords: string[]
          name: string
          name_fr: string
          records: Json
        }[]
      }
      insert_session: {
        Args: {
          p_activity_color: string
          p_block_created_by: string
          p_coach_id: string
          p_duration_seconds: number
          p_intensity_id: string
          p_program_enrollment_id: string
          p_program_id: string
          p_rpe_rating: number
          p_scheduled_date: string
          p_scheduled_time: string
          p_session_description: string
          p_session_status: string
          p_session_title: string
          p_session_type: string
          p_sport_ids: string[]
          p_theme_ids: string[]
          p_training_blocks: Json
          p_user_feedback: string
        }
        Returns: Json
      }
      number_of_users_by_role: {
        Args: { period: string }
        Returns: {
          current_period: number
          previous_period: number
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
    }
    Enums: {
      connection_status: "pending" | "accepted" | "declined" | "blocked"
      gender: "female" | "male" | "nonbinary" | "prefer_not_to_say"
      injury_severity: "mild" | "moderate" | "severe"
      injury_status: "in_progress" | "healed" | "chronic"
      objective_category: "event" | "health" | "performance"
      objective_status: "active" | "completed" | "paused" | "canceled"
      physiological_metric: "fc_max" | "vma" | "pma" | "ftp"
      program_type: "program" | "programmation" | "session_template"
      session_note_type:
        | "pre_session"
        | "post_session"
        | "coach_note"
        | "user_note"
      session_status:
        | "upcoming"
        | "in_progress"
        | "completed"
        | "skipped"
        | "canceled"
      session_type: "program" | "individual" | "programmation" | "personal"
      sport_level:
        | "beginner"
        | "intermediate"
        | "advanced"
        | "confirmed"
        | "expert"
      subscription_status:
        | "trial"
        | "active"
        | "canceled"
        | "expired"
        | "past_due"
      subscription_type: "monthly" | "yearly"
      timer_type:
        | "stopwatch"
        | "countdown"
        | "emom"
        | "amrap"
        | "tabata"
        | "custom"
      user_role: "admin" | "coach" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      connection_status: ["pending", "accepted", "declined", "blocked"],
      gender: ["female", "male", "nonbinary", "prefer_not_to_say"],
      injury_severity: ["mild", "moderate", "severe"],
      injury_status: ["in_progress", "healed", "chronic"],
      objective_category: ["event", "health", "performance"],
      objective_status: ["active", "completed", "paused", "canceled"],
      physiological_metric: ["fc_max", "vma", "pma", "ftp"],
      program_type: ["program", "programmation", "session_template"],
      session_note_type: [
        "pre_session",
        "post_session",
        "coach_note",
        "user_note",
      ],
      session_status: [
        "upcoming",
        "in_progress",
        "completed",
        "skipped",
        "canceled",
      ],
      session_type: ["program", "individual", "programmation", "personal"],
      sport_level: [
        "beginner",
        "intermediate",
        "advanced",
        "confirmed",
        "expert",
      ],
      subscription_status: [
        "trial",
        "active",
        "canceled",
        "expired",
        "past_due",
      ],
      subscription_type: ["monthly", "yearly"],
      timer_type: [
        "stopwatch",
        "countdown",
        "emom",
        "amrap",
        "tabata",
        "custom",
      ],
      user_role: ["admin", "coach", "user"],
    },
  },
} as const
