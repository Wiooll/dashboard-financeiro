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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { profileService, Profile, FamilyMember } from '../services/profileService';

const Perfil: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    email: '',
    accessLevel: 'viewer',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleOpenDialog = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      accessLevel: 'viewer',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
  };

  const handleSave = async () => {
    try {
      if (editingMember?.id) {
        await profileService.updateFamilyMember(editingMember.id, formData as FamilyMember);
      } else {
        await profileService.addFamilyMember(formData as FamilyMember);
      }
      handleCloseDialog();
      loadProfile();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await profileService.deleteFamilyMember(id);
        loadProfile();
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
      }
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData(member);
    setOpenDialog(true);
  };

  if (!profile) {
    return (
      <Box className="space-y-6">
        <Typography variant="h4" className="text-gray-800 mb-6">
          Configurações do Perfil
        </Typography>
        <Paper className="p-4">
          <Typography variant="h6" className="mb-4">
            Bem-vindo! Crie seu perfil para começar.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const defaultProfile = {
                name: "Meu Perfil",
                email: "meu@email.com",
                familyName: "Minha Família"
              };
              profileService.createProfile(defaultProfile).then(() => {
                loadProfile();
              });
            }}
          >
            Criar Perfil
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Typography variant="h4" className="text-gray-800 mb-6">
        Configurações do Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Informações do Perfil */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Typography variant="h6" className="mb-4">
              Informações do Perfil
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={profile.name}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome da Família"
                  value={profile.familyName}
                  disabled
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Lista de Membros */}
        <Grid item xs={12} md={6}>
          <Paper className="p-4">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h6">
                Membros da Família
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Adicionar Membro
              </Button>
            </Box>
            <List>
              {profile.members?.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText
                    primary={member.name}
                    secondary={`${member.email} - ${member.accessLevel}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleEdit(member)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => member.id && handleDelete(member.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog para adicionar/editar membro */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMember ? 'Editar Membro' : 'Novo Membro'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nível de Acesso</InputLabel>
                <Select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({...formData, accessLevel: e.target.value as 'admin' | 'viewer'})}
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="viewer">Visualizador</MenuItem>
                </Select>
              </FormControl>
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

export default Perfil; 