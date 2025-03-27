import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { budgetService, BudgetCategory } from '../services/budgetService';

const categorias = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Educação',
  'Saúde',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Outros',
];

const Orcamento: React.FC = () => {
  const [categoriasOrcamento, setCategoriasOrcamento] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState<Partial<BudgetCategory>>({
    category: '',
    limit: 0,
    alert: 0,
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getAll();
      setCategoriasOrcamento(data);
    } catch (error) {
      setError('Erro ao carregar categorias de orçamento');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaCategoria({
      category: '',
      limit: 0,
      alert: 0,
    });
  };

  const handleAddCategoria = async () => {
    if (novaCategoria.category && novaCategoria.limit && novaCategoria.alert) {
      try {
        await budgetService.create({
          category: novaCategoria.category,
          limit: novaCategoria.limit,
          spent: 0,
          alert: novaCategoria.alert,
        });
        handleCloseDialog();
        loadCategorias();
      } catch (error) {
        setError('Erro ao criar categoria');
        console.error('Erro:', error);
      }
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await budgetService.delete(id);
        loadCategorias();
      } catch (error) {
        setError('Erro ao excluir categoria');
        console.error('Erro:', error);
      }
    }
  };

  const calcularProgresso = (gasto: number, limite: number) => {
    return (gasto / limite) * 100;
  };

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 100) return 'error';
    if (progresso >= 80) return 'warning';
    return 'success';
  };

  const totalLimite = categoriasOrcamento.reduce((acc, cat) => acc + cat.limit, 0);
  const totalGasto = categoriasOrcamento.reduce((acc, cat) => acc + cat.spent, 0);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Orçamento Mensal
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nova Categoria
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Resumo */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo do Orçamento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box className="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-blue-800">
                    Limite Total
                  </Typography>
                  <Typography variant="h4" className="text-blue-600">
                    R$ {totalLimite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-green-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-green-800">
                    Total Gasto
                  </Typography>
                  <Typography variant="h4" className="text-green-600">
                    R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-purple-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-purple-800">
                    Saldo Disponível
                  </Typography>
                  <Typography variant="h4" className="text-purple-600">
                    R$ {(totalLimite - totalGasto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Categorias */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Limite</TableCell>
                  <TableCell>Gasto</TableCell>
                  <TableCell>Progresso</TableCell>
                  <TableCell>Alerta</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriasOrcamento.map((categoria) => {
                  const progresso = calcularProgresso(categoria.spent, categoria.limit);
                  return (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.category}</TableCell>
                      <TableCell>
                        R$ {categoria.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        R$ {categoria.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Box className="w-full">
                          <LinearProgress
                            variant="determinate"
                            value={progresso}
                            color={getCorProgresso(progresso)}
                            className="h-2 rounded-full"
                          />
                          <Typography variant="body2" className="text-right mt-1">
                            {progresso.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        R$ {categoria.alert.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => categoria.id && handleDeleteCategoria(categoria.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Alertas de Orçamento
            </Typography>
            {categoriasOrcamento
              .filter(cat => cat.spent >= cat.alert)
              .map(categoria => (
                <Alert
                  key={categoria.id}
                  severity="warning"
                  icon={<WarningIcon />}
                  className="mb-2"
                >
                  A categoria {categoria.category} está próxima do limite de alerta!
                  Gasto: R$ {categoria.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Alert>
              ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para adicionar categoria */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Categoria de Orçamento</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={novaCategoria.category}
                label="Categoria"
                onChange={(e) => setNovaCategoria({ ...novaCategoria, category: e.target.value })}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Limite Mensal"
              type="number"
              value={novaCategoria.limit}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, limit: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Valor de Alerta"
              type="number"
              value={novaCategoria.alert}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, alert: Number(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddCategoria} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orcamento; 