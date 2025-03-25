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
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface CategoriaOrcamento {
  id: number;
  categoria: string;
  limite: number;
  gasto: number;
  alerta: number;
}

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
  const [categoriasOrcamento, setCategoriasOrcamento] = useState<CategoriaOrcamento[]>([
    {
      id: 1,
      categoria: 'Moradia',
      limite: 3000,
      gasto: 2500,
      alerta: 2700,
    },
    {
      id: 2,
      categoria: 'Alimentação',
      limite: 2000,
      gasto: 1800,
      alerta: 1900,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState<Partial<CategoriaOrcamento>>({
    categoria: '',
    limite: 0,
    alerta: 0,
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaCategoria({
      categoria: '',
      limite: 0,
      alerta: 0,
    });
  };

  const handleAddCategoria = () => {
    if (novaCategoria.categoria && novaCategoria.limite && novaCategoria.alerta) {
      const novoId = Math.max(...categoriasOrcamento.map(c => c.id)) + 1;
      setCategoriasOrcamento([
        ...categoriasOrcamento,
        {
          id: novoId,
          categoria: novaCategoria.categoria,
          limite: novaCategoria.limite,
          gasto: 0,
          alerta: novaCategoria.alerta,
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteCategoria = (id: number) => {
    setCategoriasOrcamento(categoriasOrcamento.filter(categoria => categoria.id !== id));
  };

  const calcularProgresso = (gasto: number, limite: number) => {
    return (gasto / limite) * 100;
  };

  const getCorProgresso = (progresso: number) => {
    if (progresso >= 100) return 'error';
    if (progresso >= 80) return 'warning';
    return 'success';
  };

  const totalLimite = categoriasOrcamento.reduce((acc, cat) => acc + cat.limite, 0);
  const totalGasto = categoriasOrcamento.reduce((acc, cat) => acc + cat.gasto, 0);

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
                  const progresso = calcularProgresso(categoria.gasto, categoria.limite);
                  return (
                    <TableRow key={categoria.id}>
                      <TableCell>{categoria.categoria}</TableCell>
                      <TableCell>
                        R$ {categoria.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        R$ {categoria.gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                        R$ {categoria.alerta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCategoria(categoria.id)}
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
              .filter(cat => cat.gasto >= cat.alerta)
              .map(categoria => (
                <Alert
                  key={categoria.id}
                  severity="warning"
                  icon={<WarningIcon />}
                  className="mb-2"
                >
                  A categoria {categoria.categoria} está próxima do limite de alerta!
                  Gasto: R$ {categoria.gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                value={novaCategoria.categoria}
                label="Categoria"
                onChange={(e) => setNovaCategoria({ ...novaCategoria, categoria: e.target.value })}
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
              value={novaCategoria.limite}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, limite: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Valor de Alerta"
              type="number"
              value={novaCategoria.alerta}
              onChange={(e) => setNovaCategoria({ ...novaCategoria, alerta: Number(e.target.value) })}
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