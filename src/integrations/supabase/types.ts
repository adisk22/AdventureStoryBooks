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
      _supabase_migrations: {
        Row: {
          name: string | null
          statements: string[] | null
          version: string
        }
        Insert: {
          name?: string | null
          statements?: string[] | null
          version: string
        }
        Update: {
          name?: string | null
          statements?: string[] | null
          version?: string
        }
        Relationships: []
      }
      biomes: {
        Row: {
          description: string | null
          gradient: string | null
          id: string
          image: string | null
          name: string
          storyCount: number
          unlocked: boolean | null
        }
        Insert: {
          description?: string | null
          gradient?: string | null
          id: string
          image?: string | null
          name: string
          storyCount?: number
          unlocked?: boolean | null
        }
        Update: {
          description?: string | null
          gradient?: string | null
          id?: string
          image?: string | null
          name?: string
          storyCount?: number
          unlocked?: boolean | null
        }
        Relationships: []
      }
      savedStories: {
        Row: {
          beginningPrompt: string | null
          biome: string | null
          created_at: string
          id: number
          title: string | null
        }
        Insert: {
          beginningPrompt?: string | null
          biome?: string | null
          created_at?: string
          id?: number
          title?: string | null
        }
        Update: {
          beginningPrompt?: string | null
          biome?: string | null
          created_at?: string
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      storyPagesToStory: {
        Row: {
          biome: string | null
          id: number
          imageUrl: string | null
          nextPrompt: string | null
          pageNum: number | null
          storyID: number | null
          text: string | null
        }
        Insert: {
          biome?: string | null
          id?: number
          imageUrl?: string | null
          nextPrompt?: string | null
          pageNum?: number | null
          storyID?: number | null
          text?: string | null
        }
        Update: {
          biome?: string | null
          id?: number
          imageUrl?: string | null
          nextPrompt?: string | null
          pageNum?: number | null
          storyID?: number | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storyPagesToStory_storyID_fkey"
            columns: ["storyID"]
            isOneToOne: false
            referencedRelation: "savedStories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_literary_goal_points: {
        Args: { goal_uuid: string; user_uuid: string }
        Returns: number
      }
      can_unlock_biome: {
        Args: { biome_uuid: string; user_uuid: string }
        Returns: boolean
      }
      get_user_unlocked_biomes: {
        Args: { user_uuid: string }
        Returns: {
          biome_id: string
          biome_name: string
          unlock_points: number
        }[]
      }
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      goal_type:
        | "adjective"
        | "verb"
        | "dialogue"
        | "description"
        | "plot_element"
        | "character_development"
      interaction_type: "like" | "view" | "comment"
      story_status: "draft" | "in_progress" | "completed" | "published"
      user_role: "student" | "teacher" | "admin"
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
      difficulty_level: ["beginner", "intermediate", "advanced"],
      goal_type: [
        "adjective",
        "verb",
        "dialogue",
        "description",
        "plot_element",
        "character_development",
      ],
      interaction_type: ["like", "view", "comment"],
      story_status: ["draft", "in_progress", "completed", "published"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
