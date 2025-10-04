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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          avatar_url: string | null
          role: 'student' | 'teacher' | 'admin'
          class_id: string | null
          total_points: number
          level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name: string
          avatar_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          class_id?: string | null
          total_points?: number
          level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          avatar_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          class_id?: string | null
          total_points?: number
          level?: number
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          teacher_id: string | null
          school_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          teacher_id?: string | null
          school_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          teacher_id?: string | null
          school_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      biomes: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          gradient_class: string | null
          unlock_points: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          gradient_class?: string | null
          unlock_points?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          gradient_class?: string | null
          unlock_points?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      literary_goals: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'adjective' | 'verb' | 'dialogue' | 'description' | 'plot_element' | 'character_development'
          points: number
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'adjective' | 'verb' | 'dialogue' | 'description' | 'plot_element' | 'character_development'
          points?: number
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'adjective' | 'verb' | 'dialogue' | 'description' | 'plot_element' | 'character_development'
          points?: number
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          title: string
          author_id: string
          biome_id: string
          status: 'draft' | 'in_progress' | 'completed' | 'published'
          content: Json | null
          literary_goals: Json | null
          generated_images: Json | null
          original_images: Json | null
          likes_count: number
          views_count: number
          word_count: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          author_id: string
          biome_id: string
          status?: 'draft' | 'in_progress' | 'completed' | 'published'
          content?: Json | null
          literary_goals?: Json | null
          generated_images?: Json | null
          original_images?: Json | null
          likes_count?: number
          views_count?: number
          word_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          author_id?: string
          biome_id?: string
          status?: 'draft' | 'in_progress' | 'completed' | 'published'
          content?: Json | null
          literary_goals?: Json | null
          generated_images?: Json | null
          original_images?: Json | null
          likes_count?: number
          views_count?: number
          word_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      story_pages: {
        Row: {
          id: string
          story_id: string
          page_number: number
          text_content: string
          image_url: string | null
          character_images: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          page_number: number
          text_content: string
          image_url?: string | null
          character_images?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          page_number?: number
          text_content?: string
          image_url?: string | null
          character_images?: Json | null
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          biome_id: string | null
          points_earned: number
          stories_completed: number
          literary_goals_completed: Json
          unlocked_biomes: Json
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          biome_id?: string | null
          points_earned?: number
          stories_completed?: number
          literary_goals_completed?: Json
          unlocked_biomes?: Json
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          biome_id?: string | null
          points_earned?: number
          stories_completed?: number
          literary_goals_completed?: Json
          unlocked_biomes?: Json
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
      }
      story_interactions: {
        Row: {
          id: string
          story_id: string
          user_id: string
          interaction_type: 'like' | 'view' | 'comment'
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          interaction_type: 'like' | 'view' | 'comment'
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          interaction_type?: 'like' | 'view' | 'comment'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_unlocked_biomes: {
        Args: {
          user_uuid: string
        }
        Returns: {
          biome_id: string
          biome_name: string
          unlock_points: number
        }[]
      }
      can_unlock_biome: {
        Args: {
          user_uuid: string
          biome_uuid: string
        }
        Returns: boolean
      }
      award_literary_goal_points: {
        Args: {
          user_uuid: string
          goal_uuid: string
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'student' | 'teacher' | 'admin'
      story_status: 'draft' | 'in_progress' | 'completed' | 'published'
      goal_type: 'adjective' | 'verb' | 'dialogue' | 'description' | 'plot_element' | 'character_development'
      difficulty_level: 'beginner' | 'intermediate' | 'advanced'
      interaction_type: 'like' | 'view' | 'comment'
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
    Enums: {},
  },
} as const
