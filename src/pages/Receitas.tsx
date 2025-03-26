import React, { useState, useEffect } from 'react';
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
import { transactionService, Transaction } from '../services/api';

const Receitas: React.FC = () => {
  const [receitas, setReceitas] = useState<Transaction[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReceita, setEditingReceita] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState<Transaction>({
    date: '',
    description: '',
    amount: 0,
    category: '',
    type: 'income'
  });

  useEffect(() => {
    loadReceitas();
  }, []);

  const loadReceitas = async () => {
    try {
      const transactions = await transactionService.getAll();
      setReceitas(transactions.filter(t => t.type === 'income'));
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    }
  };

  const handleOpenDialog = () => {
    setEditingReceita(null);
    setFormData({
      date: '',
      description: '',
      amount: 0,
      category: '',
      type: 'income'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReceita(null);
  };

  const handleSave = async () => {
    try {
      if (editingReceita?.id) {
        await transactionService.update(editingReceita.id, formData);
      } else {
        await transactionService.create(formData);
      }
      handleCloseDialog();
      loadReceitas();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await transactionService.delete(id);
        loadReceitas();
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
    }
  };

  const handleEdit = (receita: Transaction) => {
    setEditingReceita(receita);
    setFormData(receita);
    setOpenDialog(true);
  };

  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.amount, 0);

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
                      .filter(r => r.type === 'income')
                      .reduce((acc, r) => acc + r.amount, 0)
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
                      .filter(r => r.type === 'income')
                      .reduce((acc, r) => acc + r.amount, 0)
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
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id}>
                    <TableCell>{receita.date}</TableCell>
                    <TableCell>{receita.description}</TableCell>
                    <TableCell>{receita.category}</TableCell>
                    <TableCell>R$ {receita.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(receita)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => receita.id && handleDelete(receita.id)}>
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
        <DialogTitle>
          {editingReceita ? 'Editar Receita' : 'Nova Receita'}
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

export default Receitas; 