import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Receitas from './pages/Receitas';
import Despesas from './pages/Despesas';
import Orcamento from './pages/Orcamento';
import Relatorios from './pages/Relatorios';
import Planejamento from './pages/Planejamento';
import Dividas from './pages/Dividas';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/orcamento" element={<Orcamento />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/planejamento" element={<Planejamento />} />
          <Route path="/dividas" element={<Dividas />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
