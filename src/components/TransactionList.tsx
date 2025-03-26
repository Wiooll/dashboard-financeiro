import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { transactionService, Transaction } from '../services/api';
import { TransactionEditModal } from './TransactionEditModal';

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Adicione um feedback visual de erro aqui
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await transactionService.delete(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        // Adicione um feedback visual de erro aqui
      }
    }
  };

  const handleSave = async (transaction: Transaction) => {
    try {
      if (editingTransaction?.id) {
        await transactionService.update(editingTransaction.id, transaction);
      } else {
        const newTransaction = await transactionService.create(transaction);
        setTransactions(prev => [...prev, newTransaction]);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      await loadTransactions(); // Recarrega a lista após salvar
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      // Adicione um feedback visual de erro aqui
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: 20 }}
      >
        Nova Transação
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  R$ {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(transaction)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => transaction.id && handleDelete(transaction.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TransactionEditModal
        open={isModalOpen}
        transaction={editingTransaction}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSave}
      />
    </>
  );
} 