import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
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
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useProfile } from '../contexts/ProfileContext';
import { profileService, Profile, FamilyMember } from '../services/profileService';

const Perfil: React.FC = () => {
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: profile?.name || '',
    email: profile?.email || '',
    familyName: profile?.familyName || '',
  });
  const [memberForm, setMemberForm] = useState<Partial<FamilyMember>>({
    name: '',
    email: '',
    accessLevel: 'viewer',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (profile?.id) {
        const updatedProfile = await profileService.updateProfile({
          ...profile,
          ...formData,
        });
        setProfile(updatedProfile);
      } else {
        const newProfile = await profileService.createProfile(formData as Omit<Profile, 'id' | 'members'>);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member?: FamilyMember) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        name: member.name,
        email: member.email,
        accessLevel: member.accessLevel,
      });
    } else {
      setEditingMember(null);
      setMemberForm({
        name: '',
        email: '',
        accessLevel: 'viewer',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
    setMemberForm({
      name: '',
      email: '',
      accessLevel: 'viewer',
    });
  };

  const handleMemberSubmit = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      if (editingMember?.id) {
        const updatedMember = await profileService.updateFamilyMember(
          editingMember.id,
          memberForm as FamilyMember
        );
        setProfile({
          ...profile,
          members: profile.members.map(m =>
            m.id === updatedMember.id ? updatedMember : m
          ),
        });
      } else {
        const newMember = await profileService.addFamilyMember(memberForm as FamilyMember);
        setProfile({
          ...profile,
          members: [...profile.members, newMember],
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      await profileService.deleteFamilyMember(id);
      setProfile({
        ...profile,
        members: profile.members.filter(m => m.id !== id),
      });
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Box className="space-y-6">
        <Typography variant="h4" className="text-gray-800">
          Bem-vindo ao Dashboard Financeiro
        </Typography>

        <Paper className="p-6">
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <PersonIcon sx={{ fontSize: 60 }} color="primary" />
            <Typography variant="h6" align="center">
              Para começar, crie seu perfil
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              Configure suas informações pessoais e comece a gerenciar suas finanças
            </Typography>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Nome da Família"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Criar Perfil'}
              </Button>
            </form>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="space-y-6">
      <Typography variant="h4" className="text-gray-800">
        Perfil do Usuário
      </Typography>

      <Paper className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Família"
                name="familyName"
                value={formData.familyName}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
          <Box className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Salvar Perfil'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper className="p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6">Membros da Família</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Adicionar Membro
          </Button>
        </Box>

        <List>
          {profile.members?.map((member) => (
            <ListItem key={member.id}>
              <ListItemText
                primary={member.name}
                secondary={`${member.email} - ${member.accessLevel === 'admin' ? 'Administrador' : 'Visualizador'}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleOpenDialog(member)}
                  className="mr-2"
                  disabled={loading}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteMember(member.id!)}
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Nome"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Nível de Acesso</InputLabel>
              <Select
                value={memberForm.accessLevel}
                label="Nível de Acesso"
                onChange={(e) => setMemberForm({ ...memberForm, accessLevel: e.target.value as 'admin' | 'viewer' })}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="viewer">Visualizador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleMemberSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil; 