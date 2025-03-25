import React from 'react';
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
  const saldoTotal = 30000;
  const receitas = 8500;
  const despesas = 5200;

  const dadosGrafico = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [8000, 8200, 8500, 8300, 8500, 8500],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Despesas',
        data: [5000, 5100, 5200, 5100, 5200, 5200],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução Financeira',
      },
    },
  };

  return (
    <Box className="space-y-6">
      <Typography variant="h4" className="text-gray-800 mb-6">
        Visão Geral
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de Resumo */}
        <Grid item xs={12} md={3}>
          <Card className="bg-blue-50">
            <CardContent>
              <Box className="flex items-center space-x-2">
                <AccountBalance className="text-blue-600" />
                <Typography variant="h6" className="text-blue-800">
                  Saldo Total
                </Typography>
              </Box>
              <Typography variant="h4" className="text-blue-600 mt-2">
                R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-green-50">
            <CardContent>
              <Box className="flex items-center space-x-2">
                <TrendingUp className="text-green-600" />
                <Typography variant="h6" className="text-green-800">
                  Receitas
                </Typography>
              </Box>
              <Typography variant="h4" className="text-green-600 mt-2">
                R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-red-50">
            <CardContent>
              <Box className="flex items-center space-x-2">
                <TrendingDown className="text-red-600" />
                <Typography variant="h6" className="text-red-800">
                  Despesas
                </Typography>
              </Box>
              <Typography variant="h4" className="text-red-600 mt-2">
                R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="bg-purple-50">
            <CardContent>
              <Box className="flex items-center space-x-2">
                <AttachMoney className="text-purple-600" />
                <Typography variant="h6" className="text-purple-800">
                  Economia
                </Typography>
              </Box>
              <Typography variant="h4" className="text-purple-600 mt-2">
                R$ {(receitas - despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Line options={opcoesGrafico} data={dadosGrafico} />
          </Paper>
        </Grid>

        {/* Ações Rápidas */}
        <Grid item xs={12}>
          <Box className="flex space-x-4">
            <Button
              variant="contained"
              color="success"
              startIcon={<TrendingUp />}
            >
              Nova Receita
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<TrendingDown />}
            >
              Nova Despesa
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 