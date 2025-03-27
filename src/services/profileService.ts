import { v4 as uuidv4 } from 'uuid';

export interface FamilyMember {
  id?: number;
  name: string;
  email: string;
  accessLevel: 'admin' | 'viewer';
}

export interface Profile {
  id?: number;
  name: string;
  email: string;
  familyName: string;
  members: FamilyMember[];
}

const PROFILE_KEY = 'user_profile';

const getStoredProfile = (): Profile | null => {
  try {
    const profileStr = localStorage.getItem(PROFILE_KEY);
    return profileStr ? JSON.parse(profileStr) : null;
  } catch (error) {
    console.error('Erro ao ler perfil do localStorage:', error);
    return null;
  }
};

const saveProfile = (profile: Profile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Erro ao salvar perfil no localStorage:', error);
  }
};

export const profileService = {
  getProfile: async (): Promise<Profile | null> => {
    return getStoredProfile();
  },

  createProfile: async (profile: Omit<Profile, 'id' | 'members'>): Promise<Profile> => {
    const newProfile: Profile = {
      id: Date.now(),
      ...profile,
      members: []
    };
    saveProfile(newProfile);
    return newProfile;
  },

  updateProfile: async (profile: Profile): Promise<Profile> => {
    saveProfile(profile);
    return profile;
  },

  addFamilyMember: async (member: Omit<FamilyMember, 'id'>): Promise<FamilyMember> => {
    const profile = getStoredProfile();
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }

    const newMember: FamilyMember = {
      id: Date.now(),
      ...member
    };

    profile.members.push(newMember);
    saveProfile(profile);
    return newMember;
  },

  updateFamilyMember: async (id: number, member: FamilyMember): Promise<FamilyMember> => {
    const profile = getStoredProfile();
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }

    const index = profile.members.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Membro não encontrado');
    }

    profile.members[index] = { ...member, id };
    saveProfile(profile);
    return profile.members[index];
  },

  deleteFamilyMember: async (id: number): Promise<void> => {
    const profile = getStoredProfile();
    if (!profile) {
      throw new Error('Perfil não encontrado');
    }

    profile.members = profile.members.filter(m => m.id !== id);
    saveProfile(profile);
  }
}; 