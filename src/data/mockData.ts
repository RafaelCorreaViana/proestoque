import { theme } from '../constants/theme';

export type Categoria = {
  id: string;
  nome: string;
  cor: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  unidade: string;
  categoriaId: string;
  imagem?: string;
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
    descricao: 'Café torrado e moído especial',
    preco: 25.90,
    estoque: 4,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '2',
  },
  {
    id: '2',
    nome: 'Água Mineral 500ml',
    descricao: 'Água mineral sem gás',
    preco: 2.50,
    estoque: 48,
    estoqueMinimo: 24,
    unidade: 'un',
    categoriaId: '1',
  },
  {
    id: '3',
    nome: 'Arroz Branco 5kg',
    descricao: 'Arroz branco tipo 1',
    preco: 28.90,
    estoque: 15,
    estoqueMinimo: 10,
    unidade: 'cx',
    categoriaId: '2',
  },
  {
    id: '4',
    nome: 'Sabão em Pó 3kg',
    descricao: 'Sabão em pó para roupas',
    preco: 32.50,
    estoque: 0,
    estoqueMinimo: 4,
    unidade: 'cx',
    categoriaId: '3',
  },
  {
    id: '5',
    nome: 'Caneta Esferográfica',
    descricao: 'Caneta esferográfica azul',
    preco: 1.50,
    estoque: 1,
    estoqueMinimo: 20,
    unidade: 'un',
    categoriaId: '5',
  },
  {
    id: '6',
    nome: 'Suco de Laranja 1L',
    descricao: 'Suco integral de laranja',
    preco: 12.90,
    estoque: 6,
    estoqueMinimo: 12,
    unidade: 'un',
    categoriaId: '1',
  },
  {
    id: '7',
    nome: 'Feijão Carioca 1kg',
    descricao: 'Feijão carioca tipo 1',
    preco: 8.50,
    estoque: 3,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '2',
  },
  {
    id: '8',
    nome: 'Detergente Líquido',
    descricao: 'Detergente líquido neutro',
    preco: 2.80,
    estoque: 25,
    estoqueMinimo: 15,
    unidade: 'un',
    categoriaId: '3',
  },
  {
    id: '9',
    nome: 'Creme Dental 90g',
    descricao: 'Creme dental com flúor',
    preco: 4.50,
    estoque: 20,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '4',
  },
  {
    id: '10',
    nome: 'Caderno Universitário',
    descricao: 'Caderno 10 matérias',
    preco: 18.90,
    estoque: 12,
    estoqueMinimo: 10,
    unidade: 'un',
    categoriaId: '5',
  },
];

export function getStatusEstoque(produto: Produto): StatusEstoque {
  if (produto.estoque === 0) return 'sem_estoque';
  if (produto.estoque < produto.estoqueMinimo) return 'baixo';
  return 'normal';
}

export function getCategoriaNome(categoriaId: string): string {
  const categoria = CATEGORIAS_MOCK.find(c => c.id === categoriaId);
  return categoria ? categoria.nome : 'Desconhecida';
}
