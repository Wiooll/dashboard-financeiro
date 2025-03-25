import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface Receita {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  recorrente: boolean;
  membro: string;
}

const categorias = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguéis',
  'Outros',
];

const membros = ['João Silva', 'Maria Silva'];

const Receitas: React.FC = () => {
  const [receitas, setReceitas] = useState<Receita[]>([
    {
      id: 1,
      descricao: 'Salário',
      valor: 5000,
      categoria: 'Salário',
      data: '2024-03-15',
      recorrente: true,
      membro: 'João Silva',
    },
    {
      id: 2,
      descricao: 'Freelance',
      valor: 1500,
      categoria: 'Freelance',
      data: '2024-03-20',
      recorrente: false,
      membro: 'Maria Silva',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaReceita, setNovaReceita] = useState<Partial<Receita>>({
    descricao: '',
    valor: 0,
    categoria: '',
    data: new Date().toISOString().split('T')[0],
    recorrente: false,
    membro: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaReceita({
      descricao: '',
      valor: 0,
      categoria: '',
      data: new Date().toISOString().split('T')[0],
      recorrente: false,
      membro: '',
    });
  };

  const handleAddReceita = () => {
    if (novaReceita.descricao && novaReceita.valor && novaReceita.categoria && novaReceita.membro) {
      const novoId = Math.max(...receitas.map(r => r.id)) + 1;
      setReceitas([
        ...receitas,
        {
          id: novoId,
          descricao: novaReceita.descricao,
          valor: novaReceita.valor,
          categoria: novaReceita.categoria,
          data: novaReceita.data || new Date().toISOString().split('T')[0],
          recorrente: novaReceita.recorrente || false,
          membro: novaReceita.membro,
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteReceita = (id: number) => {
    setReceitas(receitas.filter(receita => receita.id !== id));
  };

  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Receitas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nova Receita
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Resumo */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo de Receitas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box className="bg-green-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-green-800">
                    Total de Receitas
                  </Typography>
                  <Typography variant="h4" className="text-green-600">
                    R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-blue-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-blue-800">
                    Receitas Recorrentes
                  </Typography>
                  <Typography variant="h4" className="text-blue-600">
                    R$ {receitas
                      .filter(r => r.recorrente)
                      .reduce((acc, r) => acc + r.valor, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-purple-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-purple-800">
                    Receitas Eventuais
                  </Typography>
                  <Typography variant="h4" className="text-purple-600">
                    R$ {receitas
                      .filter(r => !r.recorrente)
                      .reduce((acc, r) => acc + r.valor, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Receitas */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Membro</TableCell>
                  <TableCell>Recorrente</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id}>
                    <TableCell>{new Date(receita.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{receita.descricao}</TableCell>
                    <TableCell>{receita.categoria}</TableCell>
                    <TableCell>
                      R$ {receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{receita.membro}</TableCell>
                    <TableCell>{receita.recorrente ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteReceita(receita.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Dialog para adicionar receita */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Receita</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Descrição"
              value={novaReceita.descricao}
              onChange={(e) => setNovaReceita({ ...novaReceita, descricao: e.target.value })}
            />
            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={novaReceita.valor}
              onChange={(e) => setNovaReceita({ ...novaReceita, valor: Number(e.target.value) })}
            />
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={novaReceita.categoria}
                label="Categoria"
                onChange={(e) => setNovaReceita({ ...novaReceita, categoria: e.target.value })}
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
              label="Data"
              type="date"
              value={novaReceita.data}
              onChange={(e) => setNovaReceita({ ...novaReceita, data: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Membro</InputLabel>
              <Select
                value={novaReceita.membro}
                label="Membro"
                onChange={(e) => setNovaReceita({ ...novaReceita, membro: e.target.value })}
              >
                {membros.map((membro) => (
                  <MenuItem key={membro} value={membro}>
                    {membro}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={novaReceita.recorrente}
                  onChange={(e) => setNovaReceita({ ...novaReceita, recorrente: e.target.checked })}
                />
              }
              label="Receita Recorrente"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddReceita} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Receitas; 