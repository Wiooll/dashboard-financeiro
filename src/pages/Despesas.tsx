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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  subcategoria: string;
  data: string;
  recorrente: boolean;
  membro: string;
  formaPagamento: string;
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

const subcategorias = {
  Moradia: ['Aluguel', 'Condomínio', 'IPTU', 'Manutenção', 'Outros'],
  Alimentação: ['Supermercado', 'Restaurantes', 'Delivery', 'Outros'],
  Transporte: ['Combustível', 'Manutenção', 'Estacionamento', 'Outros'],
  Educação: ['Escola', 'Cursos', 'Material Escolar', 'Outros'],
  Saúde: ['Consultas', 'Medicamentos', 'Exames', 'Outros'],
  Lazer: ['Entretenimento', 'Viagens', 'Hobbies', 'Outros'],
  Vestuário: ['Roupas', 'Calçados', 'Acessórios', 'Outros'],
  Serviços: ['Internet', 'Telefone', 'Energia', 'Água', 'Outros'],
  Outros: ['Diversos'],
};

const formasPagamento = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência',
  'Outros',
];

const membros = ['João Silva', 'Maria Silva'];

const Despesas: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: 1,
      descricao: 'Aluguel',
      valor: 2000,
      categoria: 'Moradia',
      subcategoria: 'Aluguel',
      data: '2024-03-05',
      recorrente: true,
      membro: 'João Silva',
      formaPagamento: 'Transferência',
    },
    {
      id: 2,
      descricao: 'Supermercado',
      valor: 800,
      categoria: 'Alimentação',
      subcategoria: 'Supermercado',
      data: '2024-03-10',
      recorrente: true,
      membro: 'Maria Silva',
      formaPagamento: 'Cartão de Crédito',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaDespesa, setNovaDespesa] = useState<Partial<Despesa>>({
    descricao: '',
    valor: 0,
    categoria: '',
    subcategoria: '',
    data: new Date().toISOString().split('T')[0],
    recorrente: false,
    membro: '',
    formaPagamento: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaDespesa({
      descricao: '',
      valor: 0,
      categoria: '',
      subcategoria: '',
      data: new Date().toISOString().split('T')[0],
      recorrente: false,
      membro: '',
      formaPagamento: '',
    });
  };

  const handleAddDespesa = () => {
    if (
      novaDespesa.descricao &&
      novaDespesa.valor &&
      novaDespesa.categoria &&
      novaDespesa.subcategoria &&
      novaDespesa.membro &&
      novaDespesa.formaPagamento
    ) {
      const novoId = Math.max(...despesas.map(d => d.id)) + 1;
      setDespesas([
        ...despesas,
        {
          id: novoId,
          descricao: novaDespesa.descricao,
          valor: novaDespesa.valor,
          categoria: novaDespesa.categoria,
          subcategoria: novaDespesa.subcategoria,
          data: novaDespesa.data || new Date().toISOString().split('T')[0],
          recorrente: novaDespesa.recorrente || false,
          membro: novaDespesa.membro,
          formaPagamento: novaDespesa.formaPagamento,
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteDespesa = (id: number) => {
    setDespesas(despesas.filter(despesa => despesa.id !== id));
  };

  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Despesas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nova Despesa
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Resumo */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo de Despesas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box className="bg-red-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-red-800">
                    Total de Despesas
                  </Typography>
                  <Typography variant="h4" className="text-red-600">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-orange-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-orange-800">
                    Despesas Recorrentes
                  </Typography>
                  <Typography variant="h4" className="text-orange-600">
                    R$ {despesas
                      .filter(d => d.recorrente)
                      .reduce((acc, d) => acc + d.valor, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="bg-yellow-50 p-4 rounded-lg">
                  <Typography variant="h6" className="text-yellow-800">
                    Despesas Eventuais
                  </Typography>
                  <Typography variant="h4" className="text-yellow-600">
                    R$ {despesas
                      .filter(d => !d.recorrente)
                      .reduce((acc, d) => acc + d.valor, 0)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Despesas */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Subcategoria</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Membro</TableCell>
                  <TableCell>Forma de Pagamento</TableCell>
                  <TableCell>Recorrente</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {despesas.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell>{new Date(despesa.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{despesa.descricao}</TableCell>
                    <TableCell>{despesa.categoria}</TableCell>
                    <TableCell>{despesa.subcategoria}</TableCell>
                    <TableCell>
                      R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{despesa.membro}</TableCell>
                    <TableCell>{despesa.formaPagamento}</TableCell>
                    <TableCell>{despesa.recorrente ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDespesa(despesa.id)}
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

      {/* Dialog para adicionar despesa */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Despesa</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Descrição"
              value={novaDespesa.descricao}
              onChange={(e) => setNovaDespesa({ ...novaDespesa, descricao: e.target.value })}
            />
            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={novaDespesa.valor}
              onChange={(e) => setNovaDespesa({ ...novaDespesa, valor: Number(e.target.value) })}
            />
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={novaDespesa.categoria}
                label="Categoria"
                onChange={(e) => setNovaDespesa({ ...novaDespesa, categoria: e.target.value })}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Subcategoria</InputLabel>
              <Select
                value={novaDespesa.subcategoria}
                label="Subcategoria"
                onChange={(e) => setNovaDespesa({ ...novaDespesa, subcategoria: e.target.value })}
              >
                {novaDespesa.categoria &&
                  subcategorias[novaDespesa.categoria as keyof typeof subcategorias].map((subcategoria) => (
                    <MenuItem key={subcategoria} value={subcategoria}>
                      {subcategoria}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Data"
              type="date"
              value={novaDespesa.data}
              onChange={(e) => setNovaDespesa({ ...novaDespesa, data: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Membro</InputLabel>
              <Select
                value={novaDespesa.membro}
                label="Membro"
                onChange={(e) => setNovaDespesa({ ...novaDespesa, membro: e.target.value })}
              >
                {membros.map((membro) => (
                  <MenuItem key={membro} value={membro}>
                    {membro}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Forma de Pagamento</InputLabel>
              <Select
                value={novaDespesa.formaPagamento}
                label="Forma de Pagamento"
                onChange={(e) => setNovaDespesa({ ...novaDespesa, formaPagamento: e.target.value })}
              >
                {formasPagamento.map((forma) => (
                  <MenuItem key={forma} value={forma}>
                    {forma}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={novaDespesa.recorrente}
                  onChange={(e) => setNovaDespesa({ ...novaDespesa, recorrente: e.target.checked })}
                />
              }
              label="Despesa Recorrente"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddDespesa} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Despesas; 