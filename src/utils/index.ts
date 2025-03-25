export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const calcularProgresso = (valorAtual: number, valorTotal: number): number => {
  return (valorAtual / valorTotal) * 100;
};

export const getCorProgresso = (progresso: number): 'success' | 'info' | 'warning' => {
  if (progresso >= 100) return 'success';
  if (progresso >= 50) return 'info';
  return 'warning';
};

export const calcularSaldo = (receitas: number, despesas: number): number => {
  return receitas - despesas;
};

export const calcularEconomia = (receitas: number, despesas: number): number => {
  return receitas - despesas;
};

export const calcularTaxaEconomia = (receitas: number, despesas: number): number => {
  if (receitas === 0) return 0;
  return ((receitas - despesas) / receitas) * 100;
};

export const validarEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validarSenha = (senha: string): boolean => {
  return senha.length >= 8;
};

export const gerarId = (): number => {
  return Math.floor(Math.random() * 1000000);
}; 