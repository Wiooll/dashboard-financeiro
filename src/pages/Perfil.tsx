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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

interface MembroFamilia {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: 'admin' | 'visualizador';
}

const Perfil: React.FC = () => {
  const [membros, setMembros] = useState<MembroFamilia[]>([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      nivelAcesso: 'admin',
    },
    {
      id: 2,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      nivelAcesso: 'visualizador',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [novoMembro, setNovoMembro] = useState<Partial<MembroFamilia>>({
    nome: '',
    email: '',
    nivelAcesso: 'visualizador',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNovoMembro({
      nome: '',
      email: '',
      nivelAcesso: 'visualizador',
    });
  };

  const handleAddMembro = () => {
    if (novoMembro.nome && novoMembro.email) {
      const novoId = Math.max(...membros.map(m => m.id)) + 1;
      setMembros([
        ...membros,
        {
          id: novoId,
          nome: novoMembro.nome,
          email: novoMembro.email,
          nivelAcesso: novoMembro.nivelAcesso as 'admin' | 'visualizador',
        },
      ]);
      handleCloseDialog();
    }
  };

  const handleDeleteMembro = (id: number) => {
    setMembros(membros.filter(membro => membro.id !== id));
  };

  return (
    <Box className="space-y-6">
      <Typography variant="h4" className="text-gray-800 mb-6">
        Configurações do Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Informações da Família */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Informações da Família
            </Typography>
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Nome da Família"
                defaultValue="Família Silva"
              />
              <TextField
                fullWidth
                label="Endereço"
                defaultValue="Rua das Flores, 123"
              />
              <Button variant="contained" color="primary">
                Salvar Alterações
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Membros da Família */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">
                Membros da Família
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Adicionar Membro
              </Button>
            </Box>
            <List>
              {membros.map((membro) => (
                <ListItem key={membro.id}>
                  <ListItemText
                    primary={membro.nome}
                    secondary={`${membro.email} - ${membro.nivelAcesso}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteMembro(membro.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para adicionar membro */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Adicionar Membro da Família</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Nome"
              value={novoMembro.nome}
              onChange={(e) => setNovoMembro({ ...novoMembro, nome: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={novoMembro.email}
              onChange={(e) => setNovoMembro({ ...novoMembro, email: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Nível de Acesso</InputLabel>
              <Select
                value={novoMembro.nivelAcesso}
                label="Nível de Acesso"
                onChange={(e) => setNovoMembro({ ...novoMembro, nivelAcesso: e.target.value as 'admin' | 'visualizador' })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="visualizador">Visualizador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleAddMembro} variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil; 