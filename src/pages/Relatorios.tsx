import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { reportService, FinancialReport } from '../services/reportService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState('6');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<FinancialReport | null>(null);

  useEffect(() => {
    loadReport();
  }, [periodo]);

  const loadReport = async () => {
    try {
      const data = await reportService.getReport(periodo);
      setReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !report) {
    return <Typography>Carregando...</Typography>;
  }

  const dadosEvolucao = {
    labels: report.evolutionData.labels,
    datasets: [
      {
        label: 'Patrimônio Total',
        data: report.evolutionData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const dadosGastos = {
    labels: report.expensesByCategory.labels,
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: report.expensesByCategory.data,
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

  const dadosComparativo = {
    labels: report.monthlyComparison.labels,
    datasets: [
      {
        label: 'Receitas',
        data: report.monthlyComparison.income,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Despesas',
        data: report.monthlyComparison.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      },
    ],
  };

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Relatórios Financeiros
        </Typography>
        <FormControl className="w-48">
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
        {/* Resumo Financeiro */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo Financeiro
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box className="bg-green-50 p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-green-800">
                    Receitas Totais
                  </Typography>
                  <Typography variant="h5" className="text-green-600">
                    R$ {report.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-red-50 p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-red-800">
                    Despesas Totais
                  </Typography>
                  <Typography variant="h5" className="text-red-600">
                    R$ {report.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-blue-800">
                    Economia
                  </Typography>
                  <Typography variant="h5" className="text-blue-600">
                    R$ {report.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="bg-purple-50 p-4 rounded-lg">
                  <Typography variant="subtitle2" className="text-purple-800">
                    Taxa de Economia
                  </Typography>
                  <Typography variant="h5" className="text-purple-600">
                    {report.savingsRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Evolução Patrimonial
            </Typography>
            <Line data={dadosEvolucao} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Distribuição de Gastos
            </Typography>
            <Pie data={dadosGastos} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Comparativo Mensal
            </Typography>
            <Line data={dadosComparativo} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Relatorios; 