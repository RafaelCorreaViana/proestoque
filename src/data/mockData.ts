import { theme } from '../constants/theme';

export type Categoria = {
  id: string;
  nome: string;
  cor: string;
};

export type Produto = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  categoriaId: string;
  observacao?: string;
  foto?: string;
  // Compatibilidade com telas antigas:
  estoque?: number;
  estoqueMinimo?: number;
  descricao?: string;
};

export type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: '1', nome: 'Bebidas', cor: '#3B82F6' },
  { id: '2', nome: 'Alimentos', cor: '#F59E0B' },
  { id: '3', nome: 'Limpeza', cor: '#10B981' },
  { id: '4', nome: 'Higiene', cor: '#8B5CF6' },
  { id: '5', nome: 'Escritório', cor: '#64748B' },
];

export const PRODUTOS_MOCK: Produto[] = [
  {
    id: '1',
    nome: 'Café Especial 250g',
    preco: 25.90,
    quantidade: 4,
    quantidadeMinima: 10,
    estoque: 4,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '2',
    observacao: 'Café torrado e moído especial',
    descricao: 'Café torrado e moído especial',
  },
  {
    id: '2',
    nome: 'Água Mineral 500ml',
    preco: 2.50,
    quantidade: 48,
    quantidadeMinima: 24,
    estoque: 48,
    estoqueMinimo: 24,
    unidade: 'un',
    categoriaId: '1',
    observacao: 'Água mineral sem gás',
    descricao: 'Água mineral sem gás',
  },
  {
    id: '3',
    nome: 'Arroz Branco 5kg',
    preco: 28.90,
    quantidade: 15,
    quantidadeMinima: 10,
    estoque: 15,
    estoqueMinimo: 10,
    unidade: 'cx',
    categoriaId: '2',
    observacao: 'Arroz branco tipo 1',
    descricao: 'Arroz branco tipo 1',
  },
  {
    id: '4',
    nome: 'Sabão em Pó 3kg',
    preco: 32.50,
    quantidade: 0,
    quantidadeMinima: 4,
    estoque: 0,
    estoqueMinimo: 4,
    unidade: 'cx',
    categoriaId: '3',
    observacao: 'Sabão em pó para roupas',
    descricao: 'Sabão em pó para roupas',
  },
  {
    id: '5',
    nome: 'Caneta Esferográfica',
    preco: 1.50,
    quantidade: 1,
    quantidadeMinima: 20,
    estoque: 1,
    estoqueMinimo: 20,
    unidade: 'un',
    categoriaId: '5',
    observacao: 'Caneta esferográfica azul',
    descricao: 'Caneta esferográfica azul',
  },
  {
    id: '6',
    nome: 'Suco de Laranja 1L',
    preco: 12.90,
    quantidade: 6,
    quantidadeMinima: 12,
    estoque: 6,
    estoqueMinimo: 12,
    unidade: 'un',
    categoriaId: '1',
    observacao: 'Suco integral de laranja',
    descricao: 'Suco integral de laranja',
  },
  {
    id: '7',
    nome: 'Feijão Carioca 1kg',
    preco: 8.50,
    quantidade: 3,
    quantidadeMinima: 10,
    estoque: 3,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '2',
    observacao: 'Feijão carioca tipo 1',
    descricao: 'Feijão carioca tipo 1',
  },
  {
    id: '8',
    nome: 'Detergente Líquido',
    preco: 2.80,
    quantidade: 25,
    quantidadeMinima: 15,
    estoque: 25,
    estoqueMinimo: 15,
    unidade: 'un',
    categoriaId: '3',
    observacao: 'Detergente líquido neutro',
    descricao: 'Detergente líquido neutro',
  },
  {
    id: '9',
    nome: 'Creme Dental 90g',
    preco: 4.50,
    quantidade: 20,
    quantidadeMinima: 10,
    estoque: 20,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '4',
    observacao: 'Creme dental com flúor',
    descricao: 'Creme dental com flúor',
  },
  {
    id: '10',
    nome: 'Caderno Universitário',
    preco: 18.90,
    quantidade: 12,
    quantidadeMinima: 10,
    estoque: 12,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '5',
    observacao: 'Caderno 10 matérias',
    descricao: 'Caderno 10 matérias',
  },
];

export function getStatusEstoque(produto: Produto): StatusEstoque {
  const qty = produto.quantidade !== undefined ? produto.quantidade : (produto.estoque ?? 0);
  const minQty = produto.quantidadeMinima !== undefined ? produto.quantidadeMinima : (produto.estoqueMinimo ?? 0);
  if (qty === 0) return 'sem_estoque';
  if (qty < minQty) return 'baixo';
  return 'normal';
}

export function getCategoriaNome(categoriaId: string): string {
  const categoria = CATEGORIAS_MOCK.find(c => c.id === categoriaId);
  return categoria ? categoria.nome : 'Desconhecida';
}
