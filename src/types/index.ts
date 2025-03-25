export interface MembroFamilia {
  id: number;
  nome: string;
  email: string;
  nivelAcesso: 'admin' | 'membro' | 'visualizador';
}

export interface Receita {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  recorrencia: boolean;
  membro: string;
}

export interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  subcategoria: string;
  data: string;
  recorrencia: boolean;
  membro: string;
  formaPagamento: string;
}

export interface CategoriaOrcamento {
  id: number;
  categoria: string;
  limite: number;
  gasto: number;
  alerta: number;
}

export interface Meta {
  id: number;
  descricao: string;
  valor: number;
  valorAtual: number;
  prazo: string;
  categoria: 'curto' | 'medio' | 'longo';
}

export interface Divida {
  id: number;
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: string;
  status: 'pendente' | 'atrasado' | 'pago';
  tipo: 'cartao' | 'emprestimo' | 'financiamento' | 'outros';
  juros: number;
  parcelas: number;
  parcelaAtual: number;
} 