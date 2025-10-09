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
      blog_articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          id: string
          published_at: string
          read_time: number
          related_articles: string[] | null
          slug: string
          summary: string
          tags: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          published_at: string
          read_time: number
          related_articles?: string[] | null
          slug: string
          summary: string
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string
          read_time?: number
          related_articles?: string[] | null
          slug?: string
          summary?: string
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      box_recommendations: {
        Row: {
          box_description: string
          box_name: string
          box_theme: string
          created_at: string
          id: string
          reason: string | null
          session_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          box_description: string
          box_name: string
          box_theme: string
          created_at?: string
          id?: string
          reason?: string | null
          session_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          box_description?: string
          box_name?: string
          box_theme?: string
          created_at?: string
          id?: string
          reason?: string | null
          session_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "box_recommendations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      burnout_tests: {
        Row: {
          client_score: number
          completed_at: string | null
          created_at: string | null
          id: string
          personal_score: number
          recommendations: string[] | null
          risk_level: string
          total_score: number
          user_id: string | null
          work_score: number
          zena_insight: string | null
        }
        Insert: {
          client_score: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          personal_score: number
          recommendations?: string[] | null
          risk_level: string
          total_score: number
          user_id?: string | null
          work_score: number
          zena_insight?: string | null
        }
        Update: {
          client_score?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          personal_score?: number
          recommendations?: string[] | null
          risk_level?: string
          total_score?: number
          user_id?: string | null
          work_score?: number
          zena_insight?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          employee_count: number
          id: string
          industry: string | null
          license_tier: Database["public"]["Enums"]["license_tier"]
          name: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_count?: number
          id?: string
          industry?: string | null
          license_tier?: Database["public"]["Enums"]["license_tier"]
          name: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_count?: number
          id?: string
          industry?: string | null
          license_tier?: Database["public"]["Enums"]["license_tier"]
          name?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          created_at: string
          from_role: string
          id: string
          session_id: string
          text: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          from_role: string
          id?: string
          session_id: string
          text: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          from_role?: string
          id?: string
          session_id?: string
          text?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          company_id: string | null
          created_at: string
          ended_at: string | null
          id: string
          language: string
          message_count: number
          persona: string
          started_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          language?: string
          message_count?: number
          persona: string
          started_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          language?: string
          message_count?: number
          persona?: string
          started_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_stress_checkins: {
        Row: {
          checkin_date: string
          created_at: string | null
          energy_level: number
          id: string
          keyword: string | null
          mood_emoji: string
          sleep_quality: string | null
          user_id: string | null
        }
        Insert: {
          checkin_date: string
          created_at?: string | null
          energy_level: number
          id?: string
          keyword?: string | null
          mood_emoji: string
          sleep_quality?: string | null
          user_id?: string | null
        }
        Update: {
          checkin_date?: string
          created_at?: string | null
          energy_level?: number
          id?: string
          keyword?: string | null
          mood_emoji?: string
          sleep_quality?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          manager_id: string | null
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          manager_id?: string | null
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          manager_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_snapshots: {
        Row: {
          created_at: string
          id: string
          keywords_detected: string[] | null
          mood: string
          score: number
          session_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          keywords_detected?: string[] | null
          mood: string
          score: number
          session_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          keywords_detected?: string[] | null
          mood?: string
          score?: number
          session_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emotional_snapshots_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: string
          created_at: string | null
          department_id: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department_id?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department_id?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips: {
        Row: {
          actionable_tip: string
          category: string
          created_at: string | null
          frequency: string | null
          icon: string
          id: string
          short_description: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actionable_tip: string
          category: string
          created_at?: string | null
          frequency?: string | null
          icon: string
          id?: string
          short_description: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actionable_tip?: string
          category?: string
          created_at?: string | null
          frequency?: string | null
          icon?: string
          id?: string
          short_description?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      legal_contents: {
        Row: {
          category: string
          created_at: string | null
          effective_date: string
          full_text: string
          id: string
          reference: string
          related_topics: string[] | null
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          effective_date: string
          full_text: string
          id?: string
          reference: string
          related_topics?: string[] | null
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          effective_date?: string
          full_text?: string
          id?: string
          reference?: string
          related_topics?: string[] | null
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          company_id: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          employee_count: number
          id: string
          monthly_price: number
          plan_name: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          employee_count: number
          id?: string
          monthly_price: number
          plan_name: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          employee_count?: number
          id?: string
          monthly_price?: number
          plan_name?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          company_id: string
          created_at: string | null
          department_id: string
          id: string
          is_field_team: boolean | null
          name: string
          team_lead_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department_id: string
          id?: string
          is_field_team?: boolean | null
          name: string
          team_lead_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department_id?: string
          id?: string
          is_field_team?: boolean | null
          name?: string
          team_lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_article_reads: {
        Row: {
          article_id: string | null
          id: string
          read_at: string | null
          read_duration: number | null
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          id?: string
          read_at?: string | null
          read_duration?: number | null
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          id?: string
          read_at?: string | null
          read_duration?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_article_reads_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_checklists: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          items_checked: number
          total_items: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          items_checked?: number
          total_items?: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          items_checked?: number
          total_items?: number
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      qvt_analytics: {
        Row: {
          avg_qvt_score: number | null
          company_id: string | null
          date: string | null
          dominant_mood: string | null
          persona: string | null
          session_count: number | null
          snapshot_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_company_id: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "company_admin" | "manager" | "employee"
      license_tier: "starter" | "business" | "enterprise" | "custom"
      subscription_status: "active" | "inactive" | "trial" | "cancelled"
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
      app_role: ["super_admin", "company_admin", "manager", "employee"],
      license_tier: ["starter", "business", "enterprise", "custom"],
      subscription_status: ["active", "inactive", "trial", "cancelled"],
    },
  },
} as const
