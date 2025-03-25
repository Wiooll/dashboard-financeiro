import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  MembroFamilia,
  Receita,
  Despesa,
  CategoriaOrcamento,
  Meta,
  Divida,
} from '../types';

interface AppContextData {
  // Estado
  membrosFamilia: MembroFamilia[];
  receitas: Receita[];
  despesas: Despesa[];
  categoriasOrcamento: CategoriaOrcamento[];
  metas: Meta[];
  dividas: Divida[];

  // Ações
  adicionarMembroFamilia: (membro: Omit<MembroFamilia, 'id'>) => void;
  removerMembroFamilia: (id: number) => void;
  atualizarMembroFamilia: (id: number, membro: Partial<MembroFamilia>) => void;

  adicionarReceita: (receita: Omit<Receita, 'id'>) => void;
  removerReceita: (id: number) => void;
  atualizarReceita: (id: number, receita: Partial<Receita>) => void;

  adicionarDespesa: (despesa: Omit<Despesa, 'id'>) => void;
  removerDespesa: (id: number) => void;
  atualizarDespesa: (id: number, despesa: Partial<Despesa>) => void;

  adicionarCategoriaOrcamento: (categoria: Omit<CategoriaOrcamento, 'id'>) => void;
  removerCategoriaOrcamento: (id: number) => void;
  atualizarCategoriaOrcamento: (id: number, categoria: Partial<CategoriaOrcamento>) => void;

  adicionarMeta: (meta: Omit<Meta, 'id'>) => void;
  removerMeta: (id: number) => void;
  atualizarMeta: (id: number, meta: Partial<Meta>) => void;

  adicionarDivida: (divida: Omit<Divida, 'id'>) => void;
  removerDivida: (id: number) => void;
  atualizarDivida: (id: number, divida: Partial<Divida>) => void;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [membrosFamilia, setMembrosFamilia] = useState<MembroFamilia[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categoriasOrcamento, setCategoriasOrcamento] = useState<CategoriaOrcamento[]>([]);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [dividas, setDividas] = useState<Divida[]>([]);

  // Funções para Membros da Família
  const adicionarMembroFamilia = (membro: Omit<MembroFamilia, 'id'>) => {
    const novoMembro = { ...membro, id: Date.now() };
    setMembrosFamilia([...membrosFamilia, novoMembro]);
  };

  const removerMembroFamilia = (id: number) => {
    setMembrosFamilia(membrosFamilia.filter(membro => membro.id !== id));
  };

  const atualizarMembroFamilia = (id: number, membro: Partial<MembroFamilia>) => {
    setMembrosFamilia(
      membrosFamilia.map(m => (m.id === id ? { ...m, ...membro } : m))
    );
  };

  // Funções para Receitas
  const adicionarReceita = (receita: Omit<Receita, 'id'>) => {
    const novaReceita = { ...receita, id: Date.now() };
    setReceitas([...receitas, novaReceita]);
  };

  const removerReceita = (id: number) => {
    setReceitas(receitas.filter(receita => receita.id !== id));
  };

  const atualizarReceita = (id: number, receita: Partial<Receita>) => {
    setReceitas(
      receitas.map(r => (r.id === id ? { ...r, ...receita } : r))
    );
  };

  // Funções para Despesas
  const adicionarDespesa = (despesa: Omit<Despesa, 'id'>) => {
    const novaDespesa = { ...despesa, id: Date.now() };
    setDespesas([...despesas, novaDespesa]);
  };

  const removerDespesa = (id: number) => {
    setDespesas(despesas.filter(despesa => despesa.id !== id));
  };

  const atualizarDespesa = (id: number, despesa: Partial<Despesa>) => {
    setDespesas(
      despesas.map(d => (d.id === id ? { ...d, ...despesa } : d))
    );
  };

  // Funções para Categorias de Orçamento
  const adicionarCategoriaOrcamento = (categoria: Omit<CategoriaOrcamento, 'id'>) => {
    const novaCategoria = { ...categoria, id: Date.now() };
    setCategoriasOrcamento([...categoriasOrcamento, novaCategoria]);
  };

  const removerCategoriaOrcamento = (id: number) => {
    setCategoriasOrcamento(categoriasOrcamento.filter(categoria => categoria.id !== id));
  };

  const atualizarCategoriaOrcamento = (id: number, categoria: Partial<CategoriaOrcamento>) => {
    setCategoriasOrcamento(
      categoriasOrcamento.map(c => (c.id === id ? { ...c, ...categoria } : c))
    );
  };

  // Funções para Metas
  const adicionarMeta = (meta: Omit<Meta, 'id'>) => {
    const novaMeta = { ...meta, id: Date.now() };
    setMetas([...metas, novaMeta]);
  };

  const removerMeta = (id: number) => {
    setMetas(metas.filter(meta => meta.id !== id));
  };

  const atualizarMeta = (id: number, meta: Partial<Meta>) => {
    setMetas(
      metas.map(m => (m.id === id ? { ...m, ...meta } : m))
    );
  };

  // Funções para Dívidas
  const adicionarDivida = (divida: Omit<Divida, 'id'>) => {
    const novaDivida = { ...divida, id: Date.now() };
    setDividas([...dividas, novaDivida]);
  };

  const removerDivida = (id: number) => {
    setDividas(dividas.filter(divida => divida.id !== id));
  };

  const atualizarDivida = (id: number, divida: Partial<Divida>) => {
    setDividas(
      dividas.map(d => (d.id === id ? { ...d, ...divida } : d))
    );
  };

  return (
    <AppContext.Provider
      value={{
        membrosFamilia,
        receitas,
        despesas,
        categoriasOrcamento,
        metas,
        dividas,
        adicionarMembroFamilia,
        removerMembroFamilia,
        atualizarMembroFamilia,
        adicionarReceita,
        removerReceita,
        atualizarReceita,
        adicionarDespesa,
        removerDespesa,
        atualizarDespesa,
        adicionarCategoriaOrcamento,
        removerCategoriaOrcamento,
        atualizarCategoriaOrcamento,
        adicionarMeta,
        removerMeta,
        atualizarMeta,
        adicionarDivida,
        removerDivida,
        atualizarDivida,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}; 