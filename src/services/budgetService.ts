import api from './api';

export interface BudgetCategory {
  id: number;
  category: string;
  limit: number;
  spent: number;
  alert: number;
}

export const budgetService = {
  getAll: async (): Promise<BudgetCategory[]> => {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias de orçamento:', error);
      return [];
    }
  },

  create: async (category: Omit<BudgetCategory, 'id'>): Promise<BudgetCategory> => {
    try {
      const response = await api.post('/budget', category);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar categoria de orçamento:', error);
      throw error;
    }
  },

  update: async (id: number, category: Partial<BudgetCategory>): Promise<BudgetCategory> => {
    try {
      const response = await api.put(`/budget/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar categoria de orçamento:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/budget/${id}`);
    } catch (error) {
      console.error('Erro ao excluir categoria de orçamento:', error);
      throw error;
    }
  },
}; 