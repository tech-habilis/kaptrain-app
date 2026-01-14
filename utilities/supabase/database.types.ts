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
      equipment: {
        Row: {
          created_at: string | null
          icon_name: string | null
          id: string
          name: string
          name_fr: string
        }
        Insert: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          name: string
          name_fr: string
        }
        Update: {
          created_at?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          name_fr?: string
        }
        Relationships: []
      }
      exercise_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          name: string
          name_fr: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          name_fr: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          name_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      exercise_category_assignments: {
        Row: {
          category_id: string
          exercise_id: string
          id: string
        }
        Insert: {
          category_id: string
          exercise_id: string
          id?: string
        }
        Update: {
          category_id?: string
          exercise_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "exercise_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_category_assignments_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_equipment_assignments: {
        Row: {
          equipment_id: string
          exercise_id: string
          id: string
        }
        Insert: {
          equipment_id: string
          exercise_id: string
          id?: string
        }
        Update: {
          equipment_id?: string
          exercise_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_equipment_assignments_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_equipment_assignments_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_library: {
        Row: {
          created_at: string | null
          created_by: string | null
          default_duration_seconds: number | null
          default_reps: number | null
          default_rest_seconds: number | null
          default_sets: number | null
          demonstration_url: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          image_url: string | null
          instructions: string | null
          is_favorite: boolean | null
          is_public: boolean | null
          name: string
          sport_id: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          default_duration_seconds?: number | null
          default_reps?: number | null
          default_rest_seconds?: number | null
          default_sets?: number | null
          demonstration_url?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          name: string
          sport_id?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          default_duration_seconds?: number | null
          default_reps?: number | null
          default_rest_seconds?: number | null
          default_sets?: number | null
          demonstration_url?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          is_favorite?: boolean | null
          is_public?: boolean | null
          name?: string
          sport_id?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_library_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_library_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
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
          achieved_at: string
          created_at: string | null
          id: string
          label: string
          notes: string | null
          sport_id: string
          unit: string | null
          user_id: string
          value: string
          value_numeric: number | null
        }
        Insert: {
          achieved_at: string
          created_at?: string | null
          id?: string
          label: string
          notes?: string | null
          sport_id: string
          unit?: string | null
          user_id: string
          value: string
          value_numeric?: number | null
        }
        Update: {
          achieved_at?: string
          created_at?: string | null
          id?: string
          label?: string
          notes?: string | null
          sport_id?: string
          unit?: string | null
          user_id?: string
          value?: string
          value_numeric?: number | null
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
            foreignKeyName: "records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_blocks: {
        Row: {
          color: string | null
          description: string | null
          id: string
          sequence_order: number
          session_id: string
          title: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          sequence_order: number
          session_id: string
          title: string
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          sequence_order?: number
          session_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_blocks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_exercises: {
        Row: {
          description: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_library_id: string | null
          id: string
          is_completed: boolean | null
          name: string
          reps: number | null
          rest_seconds: number | null
          sequence_order: number
          session_block_id: string
          sets: number | null
          weight_kg: number | null
        }
        Insert: {
          description?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_library_id?: string | null
          id?: string
          is_completed?: boolean | null
          name: string
          reps?: number | null
          rest_seconds?: number | null
          sequence_order: number
          session_block_id: string
          sets?: number | null
          weight_kg?: number | null
        }
        Update: {
          description?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_library_id?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string
          reps?: number | null
          rest_seconds?: number | null
          sequence_order?: number
          session_block_id?: string
          sets?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_exercise_library_id_fkey"
            columns: ["exercise_library_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_session_block_id_fkey"
            columns: ["session_block_id"]
            isOneToOne: false
            referencedRelation: "session_blocks"
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
          timer_type: string
          work_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          rest_seconds?: number | null
          rounds?: number | null
          session_id: string
          timer_type: string
          work_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          rest_seconds?: number | null
          rounds?: number | null
          session_id?: string
          timer_type?: string
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
          coach_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: Database["public"]["Enums"]["user_role"]
          description: string | null
          duration_seconds: number | null
          id: string
          program_enrollment_id: string | null
          program_id: string | null
          rpe_rating: number | null
          scheduled_date: string
          scheduled_time: string | null
          session_status: Database["public"]["Enums"]["session_status"] | null
          session_type: Database["public"]["Enums"]["session_type"]
          sport_id: string | null
          title: string
          updated_at: string | null
          user_feedback: string | null
          user_id: string
        }
        Insert: {
          activity_color?: string | null
          coach_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: Database["public"]["Enums"]["user_role"]
          description?: string | null
          duration_seconds?: number | null
          id?: string
          program_enrollment_id?: string | null
          program_id?: string | null
          rpe_rating?: number | null
          scheduled_date: string
          scheduled_time?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          session_type: Database["public"]["Enums"]["session_type"]
          sport_id?: string | null
          title: string
          updated_at?: string | null
          user_feedback?: string | null
          user_id: string
        }
        Update: {
          activity_color?: string | null
          coach_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: Database["public"]["Enums"]["user_role"]
          description?: string | null
          duration_seconds?: number | null
          id?: string
          program_enrollment_id?: string | null
          program_id?: string | null
          rpe_rating?: number | null
          scheduled_date?: string
          scheduled_time?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          session_type?: Database["public"]["Enums"]["session_type"]
          sport_id?: string | null
          title?: string
          updated_at?: string | null
          user_feedback?: string | null
          user_id?: string
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
          {
            foreignKeyName: "sessions_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
          sequence_order: number
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
          sequence_order: number
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
          sequence_order?: number
          sets?: number | null
          training_block_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_block_exercises_exercise_library_id_fkey"
            columns: ["exercise_library_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
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
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
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
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
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
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
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
          id: string
          mood_level: number | null
          muscle_soreness: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          tracked_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_level?: number | null
          muscle_soreness?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          tracked_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_level?: number | null
          muscle_soreness?: number | null
          notes?: string | null
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
      [_ in never]: never
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
