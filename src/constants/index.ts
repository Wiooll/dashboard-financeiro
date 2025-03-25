export const CATEGORIAS_RECEITA = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Aluguéis',
  'Outros',
];

export const CATEGORIAS_DESPESA = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Educação',
  'Saúde',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Outros',
];

export const SUBCATEGORIAS_DESPESA = {
  Moradia: ['Aluguel', 'Condomínio', 'IPTU', 'Manutenção', 'Outros'],
  Alimentação: ['Supermercado', 'Restaurantes', 'Delivery', 'Outros'],
  Transporte: ['Combustível', 'Manutenção', 'Estacionamento', 'Outros'],
  Educação: ['Escola', 'Cursos', 'Material', 'Outros'],
  Saúde: ['Plano de Saúde', 'Medicamentos', 'Consultas', 'Outros'],
  Lazer: ['Entretenimento', 'Viagens', 'Hobbies', 'Outros'],
  Vestuário: ['Roupas', 'Calçados', 'Acessórios', 'Outros'],
  Serviços: ['Energia', 'Água', 'Internet', 'Outros'],
  Outros: ['Outros'],
};

export const FORMAS_PAGAMENTO = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência',
  'Outros',
];

export const TIPOS_DIVIDA = [
  { value: 'cartao', label: 'Cartão de Crédito' },
  { value: 'emprestimo', label: 'Empréstimo' },
  { value: 'financiamento', label: 'Financiamento' },
  { value: 'outros', label: 'Outros' },
];

export const NIVEL_ACESSO = [
  { value: 'admin', label: 'Administrador' },
  { value: 'membro', label: 'Membro' },
  { value: 'visualizador', label: 'Visualizador' },
]; 