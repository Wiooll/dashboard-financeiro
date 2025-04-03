import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Budget = Database['public']['Tables']['budgets']['Row'];
type NewBudget = Database['public']['Tables']['budgets']['Insert'];

export const budgetService = {
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        categories (
          id,
          name,
          type
        )
      `)
      .eq('user_id', userId)
      .order('month', { ascending: false });

    if (error) throw error;
    return data as (Budget & { categories: { id: string; name: string; type: string } })[];
  },

  async addBudget(budget: NewBudget) {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select(`
        *,
        categories (
          id,
          name,
          type
        )
      `)
      .single();

    if (error) throw error;
    return data as Budget & { categories: { id: string; name: string; type: string } };
  },

  async updateBudget(id: string, updates: Partial<Budget>) {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          type
        )
      `)
      .single();

    if (error) throw error;
    return data as Budget & { categories: { id: string; name: string; type: string } };
  },

  async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getBudgetsByMonth(userId: string, month: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        categories (
          id,
          name,
          type
        )
      `)
      .eq('user_id', userId)
      .eq('month', month);

    if (error) throw error;
    return data as (Budget & { categories: { id: string; name: string; type: string } })[];
  }
}; 