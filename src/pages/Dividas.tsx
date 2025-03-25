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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Divida {
  id: number;
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: string;
  status: 'pendente' | 'atrasado' | 'pago';
  tipo: 'cartao' | 'emprestimo' | 'financiamento' | 'outros';
  juros: number;
  parcelas: number;
  parcelaAtual: number;
}

const tiposDivida = [
  { value: 'cartao', label: 'Cartão de Crédito' },
  { value: 'emprestimo', label: 'Empréstimo' },
  { value: 'financiamento', label: 'Financiamento' },
  { value: 'outros', label: 'Outros' },
];

const Dividas: React.FC = () => {
  const [dividas, setDividas] = useState<Divida[]>([
    {
      id: 1,
      descricao: 'Cartão de Crédito Nubank',
      valor: 2500,
      valorPago: 0,
      dataVencimento: '2024-03-15',
      status: 'pendente',
      tipo: 'cartao',
      juros: 0,
      parcelas: 1,
      parcelaAtual: 1,
    },
    {
      id: 2,
      descricao: 'Financiamento Carro',
      valor: 15000,
      valorPago: 5000,
      dataVencimento: '2024-03-20',
      status: 'pendente',
      tipo: 'financiamento',
      juros: 1.5,
      parcelas: 48,
      parcelaAtual: 12,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novaDivida, setNovaDivida] = useState<Partial<Divida>>({
    descricao: '',
    valor: 0,
    valorPago: 0,
    dataVencimento: '',
    status: 'pendente',
    tipo: 'cartao',
    juros: 0,
    parcelas: 1,
    parcelaAtual: 1,
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovaDivida({
      descricao: '',
      valor: 0,
      valorPago: 0,
      dataVencimento: '',
      status: 'pendente',
      tipo: 'cartao',
      juros: 0,
      parcelas: 1,
      parcelaAtual: 1,
    });
  };

  const handleAddDivida = () => {
    if (novaDivida.descricao && novaDivida.valor && novaDivida.dataVencimento && novaDivida.tipo) {
      const novoId = Math.max(...dividas.map(d => d.id)) + 1;
      setDividas([
        ...dividas,
        {
          id: novoId,
          descricao: novaDivida.descricao,
          valor: novaDivida.valor,
          valorPago: novaDivida.valorPago || 0,
          dataVencimento: novaDivida.dataVencimento,
          status: novaDivida.status as 'pendente' | 'atrasado' | 'pago',
          tipo: novaDivida.tipo as 'cartao' | 'emprestimo' | 'financiamento' | 'outros',
          juros: novaDivida.juros || 0,
          parcelas: novaDivida.parcelas || 1,
          parcelaAtual: novaDivida.parcelaAtual || 1,
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteDivida = (id: number) => {
    setDividas(dividas.filter(divida => divida.id !== id));
  };

  const calcularProgresso = (valorPago: number, valor: number) => {
    return (valorPago / valor) * 100;
  };

  const getCorStatus = (status: string) => {
    switch (status) {
      case 'pago':
        return 'success';
      case 'atrasado':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'atrasado':
        return 'Atrasado';
      default:
        return 'Pendente';
    }
  };

  return (
    <Box className="space-y-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" className="text-gray-800">
          Gerenciamento de Dívidas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nova Dívida
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Resumo de Dívidas */}
        <Grid item xs={12}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Resumo de Dívidas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card className="bg-red-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <WarningIcon className="text-red-600" />
                      <Typography variant="h6" className="text-red-800">
                        Total em Dívidas
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-red-600 mt-2">
                      R$ {dividas.reduce((acc, d) => acc + d.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="bg-yellow-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <WarningIcon className="text-yellow-600" />
                      <Typography variant="h6" className="text-yellow-800">
                        Dívidas Pendentes
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-yellow-600 mt-2">
                      R$ {dividas
                        .filter(d => d.status === 'pendente')
                        .reduce((acc, d) => acc + d.valor, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card className="bg-green-50">
                  <CardContent>
                    <Box className="flex items-center space-x-2">
                      <WarningIcon className="text-green-600" />
                      <Typography variant="h6" className="text-green-800">
                        Dívidas Pagas
                      </Typography>
                    </Box>
                    <Typography variant="h4" className="text-green-600 mt-2">
                      R$ {dividas
                        .filter(d => d.status === 'pago')
                        .reduce((acc, d) => acc + d.valor, 0)
                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Dívidas */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Valor Total</TableCell>
                  <TableCell>Valor Pago</TableCell>
                  <TableCell>Progresso</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dividas.map((divida) => {
                  const progresso = calcularProgresso(divida.valorPago, divida.valor);
                  return (
                    <TableRow key={divida.id}>
                      <TableCell>{divida.descricao}</TableCell>
                      <TableCell>
                        {tiposDivida.find(t => t.value === divida.tipo)?.label}
                      </TableCell>
                      <TableCell>
                        R$ {divida.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        R$ {divida.valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Box className="w-full">
                          <LinearProgress
                            variant="determinate"
                            value={progresso}
                            color={getCorStatus(divida.status)}
                            className="h-2 rounded-full"
                          />
                          <Typography variant="body2" className="text-right mt-1">
                            {progresso.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(divida.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(divida.status)}
                          color={getCorStatus(divida.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteDivida(divida.id)}
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

      {/* Dialog para adicionar dívida */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Dívida</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Descrição"
              value={novaDivida.descricao}
              onChange={(e) => setNovaDivida({ ...novaDivida, descricao: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={novaDivida.tipo}
                label="Tipo"
                onChange={(e) => setNovaDivida({ ...novaDivida, tipo: e.target.value })}
              >
                {tiposDivida.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Valor Total"
              type="number"
              value={novaDivida.valor}
              onChange={(e) => setNovaDivida({ ...novaDivida, valor: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Valor Pago"
              type="number"
              value={novaDivida.valorPago}
              onChange={(e) => setNovaDivida({ ...novaDivida, valorPago: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Data de Vencimento"
              type="date"
              value={novaDivida.dataVencimento}
              onChange={(e) => setNovaDivida({ ...novaDivida, dataVencimento: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Taxa de Juros (%)"
              type="number"
              value={novaDivida.juros}
              onChange={(e) => setNovaDivida({ ...novaDivida, juros: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Total de Parcelas"
              type="number"
              value={novaDivida.parcelas}
              onChange={(e) => setNovaDivida({ ...novaDivida, parcelas: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Parcela Atual"
              type="number"
              value={novaDivida.parcelaAtual}
              onChange={(e) => setNovaDivida({ ...novaDivida, parcelaAtual: Number(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddDivida} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dividas; 