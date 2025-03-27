import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Receitas from './pages/Receitas';
import Despesas from './pages/Despesas';
import Orcamento from './pages/Orcamento';
import Relatorios from './pages/Relatorios';
import Planejamento from './pages/Planejamento';
import Dividas from './pages/Dividas';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
    },
    secondary: {
      main: '#10B981',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ProfileProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/perfil" element={<Perfil />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receitas"
                element={
                  <ProtectedRoute>
                    <Receitas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/despesas"
                element={
                  <ProtectedRoute>
                    <Despesas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orcamento"
                element={
                  <ProtectedRoute>
                    <Orcamento />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedRoute>
                    <Relatorios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planejamento"
                element={
                  <ProtectedRoute>
                    <Planejamento />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dividas"
                element={
                  <ProtectedRoute>
                    <Dividas />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ProfileProvider>
    </ThemeProvider>
  );
};

export default App;
