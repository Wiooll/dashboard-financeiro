import React, { useState } from 'react';
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

interface Meta {
  id: number;
  descricao: string;
  valor: number;
  valorAtual: number;
  prazo: string;
  categoria: 'curto' | 'medio' | 'longo';
}

const categorias = ['curto', 'medio', 'longo'];

const Planejamento: React.FC = () => {
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: 1,
      descricao: 'Reserva de Emergência',
      valor: 10000,
      valorAtual: 5000,
      prazo: '2024-12-31',
      categoria: 'curto',
    },
    {
      id: 2,
      descricao: 'Entrada do Apartamento',
      valor: 50000,
      valorAtual: 20000,
      prazo: '2025-12-31',
      categoria: 'medio',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaMeta, setNovaMeta] = useState<Partial<Meta>>({
    descricao: '',
    valor: 0,
    valorAtual: 0,
    prazo: '',
    categoria: 'curto',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaMeta({
      descricao: '',
      valor: 0,
      valorAtual: 0,
      prazo: '',
      categoria: 'curto',
    });
  };

  const handleAddMeta = () => {
    if (novaMeta.descricao && novaMeta.valor && novaMeta.prazo && novaMeta.categoria) {
      const novoId = Math.max(...metas.map(m => m.id)) + 1;
      setMetas([
        ...metas,
        {
          id: novoId,
          descricao: novaMeta.descricao,
          valor: novaMeta.valor,
          valorAtual: novaMeta.valorAtual || 0,
          prazo: novaMeta.prazo,
          categoria: novaMeta.categoria as 'curto' | 'medio' | 'longo',
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteMeta = (id: number) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  const calcularProgresso = (valorAtual: number, valor: number) => {
    return (valorAtual / valor) * 100;
  };

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 100) return 'success';
    if (progresso >= 50) return 'info';
    return 'warning';
  };

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
                        .filter(m => m.categoria === 'curto')
                        .reduce((acc, m) => acc + m.valor, 0)
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
                        .filter(m => m.categoria === 'medio')
                        .reduce((acc, m) => acc + m.valor, 0)
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
                        .filter(m => m.categoria === 'longo')
                        .reduce((acc, m) => acc + m.valor, 0)
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
                  const progresso = calcularProgresso(meta.valorAtual, meta.valor);
                  return (
                    <TableRow key={meta.id}>
                      <TableCell>{meta.descricao}</TableCell>
                      <TableCell>
                        R$ {meta.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        R$ {meta.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                      <TableCell>{new Date(meta.prazo).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        {meta.categoria.charAt(0).toUpperCase() + meta.categoria.slice(1)} Prazo
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMeta(meta.id)}
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

      {/* Dialog para adicionar meta */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Meta Financeira</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Descrição"
              value={novaMeta.descricao}
              onChange={(e) => setNovaMeta({ ...novaMeta, descricao: e.target.value })}
            />
            <TextField
              fullWidth
              label="Valor Alvo"
              type="number"
              value={novaMeta.valor}
              onChange={(e) => setNovaMeta({ ...novaMeta, valor: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Valor Atual"
              type="number"
              value={novaMeta.valorAtual}
              onChange={(e) => setNovaMeta({ ...novaMeta, valorAtual: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Prazo"
              type="date"
              value={novaMeta.prazo}
              onChange={(e) => setNovaMeta({ ...novaMeta, prazo: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={novaMeta.categoria}
                label="Categoria"
                onChange={(e) => setNovaMeta({ ...novaMeta, categoria: e.target.value })}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)} Prazo
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddMeta} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Planejamento; 