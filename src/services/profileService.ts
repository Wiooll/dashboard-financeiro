import api from './api';

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

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get<Profile>('/profile');
    return response.data;
  },

  createProfile: async (profile: Omit<Profile, 'id' | 'members'>): Promise<Profile> => {
    const response = await api.post<Profile>('/profile', profile);
    return response.data;
  },

  updateProfile: async (profile: Profile): Promise<Profile> => {
    const response = await api.put<Profile>('/profile', profile);
    return response.data;
  },

  addFamilyMember: async (member: FamilyMember): Promise<FamilyMember> => {
    const response = await api.post<FamilyMember>('/profile/members', member);
    return response.data;
  },

  updateFamilyMember: async (id: number, member: FamilyMember): Promise<FamilyMember> => {
    const response = await api.put<FamilyMember>(`/profile/members/${id}`, member);
    return response.data;
  },

  deleteFamilyMember: async (id: number): Promise<void> => {
    await api.delete(`/profile/members/${id}`);
  }
}; 