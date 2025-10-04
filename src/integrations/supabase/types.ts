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
      classes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          school_name: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          school_name?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_classes_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      literary_goals: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: string
          is_active: boolean | null
          points: number | null
          title: string
          type: Database["public"]["Enums"]["goal_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title: string
          type: Database["public"]["Enums"]["goal_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          title?: string
          type?: Database["public"]["Enums"]["goal_type"]
          updated_at?: string | null
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
      stories: {
        Row: {
          author_id: string
          biome_id: string
          content: Json | null
          created_at: string | null
          generated_images: Json | null
          id: string
          likes_count: number | null
          literary_goals: Json | null
          original_images: Json | null
          published_at: string | null
          status: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
          word_count: number | null
        }
        Insert: {
          author_id: string
          biome_id: string
          content?: Json | null
          created_at?: string | null
          generated_images?: Json | null
          id?: string
          likes_count?: number | null
          literary_goals?: Json | null
          original_images?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
          word_count?: number | null
        }
        Update: {
          author_id?: string
          biome_id?: string
          content?: Json | null
          created_at?: string | null
          generated_images?: Json | null
          id?: string
          likes_count?: number | null
          literary_goals?: Json | null
          original_images?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["story_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      story_pages: {
        Row: {
          character_images: Json | null
          created_at: string | null
          id: string
          image_url: string | null
          page_number: number
          story_id: string | null
          text_content: string
        }
        Insert: {
          character_images?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          page_number: number
          story_id?: string | null
          text_content: string
        }
        Update: {
          character_images?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          page_number?: number
          story_id?: string | null
          text_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_pages_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      storyPagesToStory: {
        Row: {
          biome: string | null
          continuation_option_1: string | null
          continuation_option_2: string | null
          continuation_option_3: string | null
          id: number
          imageUrl: string | null
          nextPrompt: string | null
          pageNum: number | null
          storyID: number | null
          text: string | null
        }
        Insert: {
          biome?: string | null
          continuation_option_1?: string | null
          continuation_option_2?: string | null
          continuation_option_3?: string | null
          id?: number
          imageUrl?: string | null
          nextPrompt?: string | null
          pageNum?: number | null
          storyID?: number | null
          text?: string | null
        }
        Update: {
          biome?: string | null
          continuation_option_1?: string | null
          continuation_option_2?: string | null
          continuation_option_3?: string | null
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
      users: {
        Row: {
          avatar_url: string | null
          class_id: string | null
          created_at: string | null
          display_name: string
          email: string
          id: string
          level: number | null
          points_earned: number | null
          role: string | null
          stories_completed: number | null
          total_points: number | null
          unlocked_biomes: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          display_name: string
          email: string
          id?: string
          level?: number | null
          points_earned?: number | null
          role?: string | null
          stories_completed?: number | null
          total_points?: number | null
          unlocked_biomes?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          class_id?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          level?: number | null
          points_earned?: number | null
          role?: string | null
          stories_completed?: number | null
          total_points?: number | null
          unlocked_biomes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      UsersToClass: {
        Row: {
          classID: string | null
          created_at: string
          id: number
          userID: string | null
        }
        Insert: {
          classID?: string | null
          created_at?: string
          id?: number
          userID?: string | null
        }
        Update: {
          classID?: string | null
          created_at?: string
          id?: number
          userID?: string | null
        }
        Relationships: []
      }
      UserToStories: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          story_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          story_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          story_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_interactions_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
