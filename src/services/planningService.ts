import api from './api';

export interface FinancialGoal {
  id?: number;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  category: 'short' | 'medium' | 'long';
}

export const planningService = {
  getAll: async (): Promise<FinancialGoal[]> => {
    const response = await api.get<FinancialGoal[]>('/planning/goals');
    return response.data;
  },

  create: async (goal: Omit<FinancialGoal, 'id'>): Promise<FinancialGoal> => {
    const response = await api.post<FinancialGoal>('/planning/goals', goal);
    return response.data;
  },

  update: async (id: number, goal: FinancialGoal): Promise<FinancialGoal> => {
    const response = await api.put<FinancialGoal>(`/planning/goals/${id}`, goal);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/planning/goals/${id}`);
  }
}; 