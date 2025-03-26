import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export interface Transaction {
    id?: number;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: string;
}

export const transactionService = {
    getAll: async (): Promise<Transaction[]> => {
        try {
            const response = await api.get<Transaction[]>('/transactions');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            throw error;
        }
    },

    create: async (transaction: Transaction): Promise<Transaction> => {
        try {
            const response = await api.post<{id: number}>('/transactions', transaction);
            return { ...transaction, id: response.data.id };
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            throw error;
        }
    },

    update: async (id: number, transaction: Transaction): Promise<void> => {
        try {
            await api.put(`/transactions/${id}`, transaction);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            await api.delete(`/transactions/${id}`);
        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            throw error;
        }
    }
};

export default api; 