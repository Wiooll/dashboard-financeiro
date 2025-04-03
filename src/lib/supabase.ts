import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e/ou chave anônima não configurados no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          amount: number
          description: string
          type: 'income' | 'expense'
          category: string
          date: string
          user_id: string
          created_at: string
        }
        Insert: {
          amount: number
          description: string
          type: 'income' | 'expense'
          category: string
          date: string
          user_id: string
        }
        Update: {
          amount?: number
          description?: string
          type?: 'income' | 'expense'
          category?: string
          date?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: 'income' | 'expense'
          user_id: string
          created_at: string
        }
        Insert: {
          name: string
          type: 'income' | 'expense'
          user_id: string
        }
        Update: {
          name?: string
          type?: 'income' | 'expense'
        }
      }
      budgets: {
        Row: {
          id: string
          category_id: string
          amount: number
          month: string
          user_id: string
          created_at: string
        }
        Insert: {
          category_id: string
          amount: number
          month: string
          user_id: string
        }
        Update: {
          amount?: number
          month?: string
        }
      }
    }
  }
} 