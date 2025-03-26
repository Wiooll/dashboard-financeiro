import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { transactionService, Transaction } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotais = () => {
    if (!Array.isArray(transactions)) {
      return { receitas: 0, despesas: 0, saldoTotal: 0 };
    }

    const receitas = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const despesas = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const saldoTotal = receitas - despesas;

    return { receitas, despesas, saldoTotal };
  };

  const { receitas, despesas, saldoTotal } = calcularTotais();

  const processarDadosGrafico = () => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const dadosReceitas = new Array(6).fill(0);
    const dadosDespesas = new Array(6).fill(0);

    transactions.forEach(transaction => {
      const data = new Date(transaction.date);
      const mes = data.getMonth();
      if (mes >= 0 && mes < 6) {
        if (transaction.type === 'income') {
          dadosReceitas[mes] += transaction.amount;
        } else {
          dadosDespesas[mes] += transaction.amount;
        }
      }
    });

    return {
      labels: meses,
      datasets: [
        {
          label: 'Receitas',
          data: dadosReceitas,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Despesas',
          data: dadosDespesas,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
      ],
    };
  };

  const dadosGrafico = processarDadosGrafico();

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Fluxo de Caixa',
      },
    },
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Saldo Total</Typography>
              </Box>
              <Typography variant="h4">
                R$ {saldoTotal.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Receitas</Typography>
              </Box>
              <Typography variant="h4">
                R$ {receitas.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDown sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Despesas</Typography>
              </Box>
              <Typography variant="h4">
                R$ {despesas.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AttachMoney sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Economia</Typography>
              </Box>
              <Typography variant="h4">
                {((receitas - despesas) / receitas * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Line options={opcoesGrafico} data={dadosGrafico} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 