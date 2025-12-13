export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Casos: {
        Row: {
          amount: number | null
          assistants: string | null
          case_type: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          contact_person: string | null
          court: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          fees: string | null
          file_number: string | null
          id: number
          judge: string | null
          jurisdiction: string | null
          next_hearing: string | null
          observaciones: string | null
          opponent: string | null
          opponent_lawyer: string | null
          practice_area: string | null
          responsible_lawyer: string | null
          risks: string | null
          start_date: string | null
          status: string | null
          strategy: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          assistants?: string | null
          case_type?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          contact_person?: string | null
          court?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          fees?: string | null
          file_number?: string | null
          id?: number
          judge?: string | null
          jurisdiction?: string | null
          next_hearing?: string | null
          observaciones?: string | null
          opponent?: string | null
          opponent_lawyer?: string | null
          practice_area?: string | null
          responsible_lawyer?: string | null
          risks?: string | null
          start_date?: string | null
          status?: string | null
          strategy?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          assistants?: string | null
          case_type?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          contact_person?: string | null
          court?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          fees?: string | null
          file_number?: string | null
          id?: number
          judge?: string | null
          jurisdiction?: string | null
          next_hearing?: string | null
          observaciones?: string | null
          opponent?: string | null
          opponent_lawyer?: string | null
          practice_area?: string | null
          responsible_lawyer?: string | null
          risks?: string | null
          start_date?: string | null
          status?: string | null
          strategy?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Listadecasos: {
        Row: {
          cliente: string
          created_at: string
          created_by: string
          id: number
          name: string | null
          observaciones: string | null
          status: string | null
        }
        Insert: {
          cliente?: string
          created_at?: string
          created_by?: string
          id?: number
          name?: string | null
          observaciones?: string | null
          status?: string | null
        }
        Update: {
          cliente?: string
          created_at?: string
          created_by?: string
          id?: number
          name?: string | null
          observaciones?: string | null
          status?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
