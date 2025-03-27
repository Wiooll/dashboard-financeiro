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
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { planningService, FinancialGoal } from '../services/planningService';

const categorias = ['curto', 'medio', 'longo'];

const Planejamento: React.FC = () => {
  const [metas, setMetas] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [novaMeta, setNovaMeta] = useState<Partial<FinancialGoal>>({
    description: '',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
    category: 'curto',
  });

  useEffect(() => {
    loadMetas();
  }, []);

  const loadMetas = async () => {
    try {
      const data = await planningService.getAll();
      setMetas(data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaMeta({
      description: '',
      targetValue: 0,
      currentValue: 0,
      deadline: '',
      category: 'curto',
    });
  };

  const handleAddMeta = async () => {
    if (novaMeta.description && novaMeta.targetValue && novaMeta.deadline && novaMeta.category) {
      try {
        const meta = await planningService.create(novaMeta as Omit<FinancialGoal, 'id'>);
        setMetas([...metas, meta]);
        handleCloseDialog();
      } catch (error) {
        console.error('Erro ao criar meta:', error);
      }
    }
  };

  const handleDeleteMeta = async (id: number) => {
    try {
      await planningService.delete(id);
      setMetas(metas.filter(meta => meta.id !== id));
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  const calcularProgresso = (valorAtual: number, valor: number) => {
    return (valorAtual / valor) * 100;
  };

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 100) return 'success';
    if (progresso >= 50) return 'info';
    return 'warning';
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Planejamento Financeiro
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nova Meta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Resumo de Metas */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo de Metas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card className="bg-blue-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <TrendingUpIcon className="text-blue-600" />
                      <Typography variant="h6" className="text-blue-800">
                        Metas de Curto Prazo
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-blue-600 mt-2">
                      R$ {metas
                        .filter(m => m.category === 'curto')
                        .reduce((acc, m) => acc + m.targetValue, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="bg-green-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <TrendingUpIcon className="text-green-600" />
                      <Typography variant="h6" className="text-green-800">
                        Metas de Médio Prazo
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-green-600 mt-2">
                      R$ {metas
                        .filter(m => m.category === 'medio')
                        .reduce((acc, m) => acc + m.targetValue, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="bg-purple-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <TrendingUpIcon className="text-purple-600" />
                      <Typography variant="h6" className="text-purple-800">
                        Metas de Longo Prazo
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-purple-600 mt-2">
                      R$ {metas
                        .filter(m => m.category === 'longo')
                        .reduce((acc, m) => acc + m.targetValue, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Metas */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor Alvo</TableCell>
                  <TableCell>Valor Atual</TableCell>
                  <TableCell>Progresso</TableCell>
                  <TableCell>Prazo</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metas.map((meta) => {
                  const progresso = calcularProgresso(meta.currentValue, meta.targetValue);
                  return (
                    <TableRow key={meta.id}>
                      <TableCell>{meta.description}</TableCell>
                      <TableCell>
                        R$ {meta.targetValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        R$ {meta.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                      <TableCell>{new Date(meta.deadline).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{meta.category}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteMeta(meta.id!)}
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
      </Grid>

      {/* Dialog para Nova Meta */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Nova Meta Financeira</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Descrição"
              value={novaMeta.description}
              onChange={(e) => setNovaMeta({ ...novaMeta, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Valor Alvo"
              type="number"
              value={novaMeta.targetValue}
              onChange={(e) => setNovaMeta({ ...novaMeta, targetValue: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Valor Atual"
              type="number"
              value={novaMeta.currentValue}
              onChange={(e) => setNovaMeta({ ...novaMeta, currentValue: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Prazo"
              type="date"
              value={novaMeta.deadline}
              onChange={(e) => setNovaMeta({ ...novaMeta, deadline: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={novaMeta.category}
                label="Categoria"
                onChange={(e) => setNovaMeta({ ...novaMeta, category: e.target.value as 'curto' | 'medio' | 'longo' })}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddMeta} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Planejamento; 