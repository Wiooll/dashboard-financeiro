import api from './api';

export interface FinancialReport {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  evolutionData: {
    labels: string[];
    data: number[];
  };
  expensesByCategory: {
    labels: string[];
    data: number[];
  };
  monthlyComparison: {
    labels: string[];
    income: number[];
    expenses: number[];
  };
}

export const reportService = {
  getReport: async (period: string = '6'): Promise<FinancialReport> => {
    const response = await api.get<FinancialReport>(`/reports?period=${period}`);
    return response.data;
  }
}; 