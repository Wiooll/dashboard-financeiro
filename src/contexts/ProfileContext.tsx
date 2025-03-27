import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, profileService } from '../services/profileService';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  hasProfile: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await profileService.getProfile();
        setProfile(savedProfile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSetProfile = async (newProfile: Profile | null) => {
    try {
      if (newProfile) {
        if (newProfile.id) {
          const updatedProfile = await profileService.updateProfile(newProfile);
          setProfile(updatedProfile);
        } else {
          const createdProfile = await profileService.createProfile(newProfile);
          setProfile(createdProfile);
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const contextValue = {
    profile,
    loading,
    setProfile: handleSetProfile,
    hasProfile: !!profile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile deve ser usado dentro de um ProfileProvider');
  }
  return context;
}; 