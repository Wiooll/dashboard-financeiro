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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { transactionService, Transaction } from '../services/api';

const Despesas: React.FC = () => {
  const [despesas, setDespesas] = useState<Transaction[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Transaction>({
    date: '',
    description: '',
    amount: 0,
    category: '',
    type: 'expense'
  });

  useEffect(() => {
    loadDespesas();
  }, []);

  const loadDespesas = async () => {
    try {
      const transactions = await transactionService.getAll();
      setDespesas(transactions.filter(t => t.type === 'expense'));
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    }
  };

  const handleOpenDialog = () => {
    setEditingDespesa(null);
    setFormData({
      date: '',
      description: '',
      amount: 0,
      category: '',
      type: 'expense'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDespesa(null);
  };

  const handleSave = async () => {
    try {
      if (editingDespesa?.id) {
        await transactionService.update(editingDespesa.id, formData);
      } else {
        await transactionService.create(formData);
      }
      handleCloseDialog();
      loadDespesas();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await transactionService.delete(id);
        loadDespesas();
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
      }
    }
  };

  const handleEdit = (despesa: Transaction) => {
    setEditingDespesa(despesa);
    setFormData(despesa);
    setOpenDialog(true);
  };

  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.amount, 0);

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
                  <TableCell>Valor</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {despesas.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell>{despesa.date}</TableCell>
                    <TableCell>{despesa.description}</TableCell>
                    <TableCell>{despesa.category}</TableCell>
                    <TableCell>
                      R$ {despesa.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(despesa)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => despesa.id && handleDelete(despesa.id)}>
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
        <DialogTitle>
          {editingDespesa ? 'Editar Despesa' : 'Nova Despesa'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Despesas; 