export const formatarPreco = (valor: number): string => {
  return "R$ " + valor.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export const formatarData = (iso: string): string => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  } catch {
    return "";
  }
};

export const formatarQuantidade = (qtd: number, unidade: string) =>
  `${qtd} ${unidade}`;

export const getStatusEstoque = (quantidade: number, quantidadeMinima: number): 'normal' | 'baixo' | 'sem_estoque' => {
  if (quantidade === 0) return 'sem_estoque';
  if (quantidade < quantidadeMinima) return 'baixo';
  return 'normal';
};
