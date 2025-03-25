import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState('6');

  // Dados para o gráfico de evolução patrimonial
  const dadosEvolucao = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Patrimônio Total',
        data: [30000, 32000, 35000, 34000, 38000, 40000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  // Dados para o gráfico de distribuição de gastos
  const dadosGastos = {
    labels: ['Moradia', 'Alimentação', 'Transporte', 'Educação', 'Saúde', 'Lazer', 'Outros'],
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: [3000, 2000, 1500, 1000, 800, 500, 400],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(139, 92, 246, 0.5)',
          'rgba(236, 72, 153, 0.5)',
          'rgba(14, 165, 233, 0.5)',
          'rgba(107, 114, 128, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(14, 165, 233)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de comparativo mensal
  const dadosComparativo = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [8000, 8200, 8500, 8300, 8500, 8500],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Despesas',
        data: [5000, 5100, 5200, 5100, 5200, 5200],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
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
        text: 'Evolução Patrimonial',
      },
    },
  };

  const opcoesGastos = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribuição de Gastos',
      },
    },
  };

  const opcoesComparativo = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparativo Mensal',
      },
    },
  };

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Relatórios e Análises
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={periodo}
            label="Período"
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <MenuItem value="3">Últimos 3 meses</MenuItem>
            <MenuItem value="6">Últimos 6 meses</MenuItem>
            <MenuItem value="12">Último ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Evolução Patrimonial */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Line options={opcoesGrafico} data={dadosEvolucao} />
          </Paper>
        </Grid>

        {/* Distribuição de Gastos */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Pie options={opcoesGastos} data={dadosGastos} />
          </Paper>
        </Grid>

        {/* Comparativo Mensal */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Bar options={opcoesComparativo} data={dadosComparativo} />
          </Paper>
        </Grid>

        {/* Resumo Financeiro */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo Financeiro
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box className="bg-green-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-green-800">
                    Receitas Totais
                  </Typography>
                  <Typography variant="h4" className="text-green-600">
                    R$ 50.000,00
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-red-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-red-800">
                    Despesas Totais
                  </Typography>
                  <Typography variant="h4" className="text-red-600">
                    R$ 30.700,00
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-blue-800">
                    Economia
                  </Typography>
                  <Typography variant="h4" className="text-blue-600">
                    R$ 19.300,00
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-purple-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-purple-800">
                    Taxa de Economia
                  </Typography>
                  <Typography variant="h4" className="text-purple-600">
                    38,6%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Relatorios; 