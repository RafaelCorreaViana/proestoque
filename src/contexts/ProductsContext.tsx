import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { api } from "../services/api";
import type { ProdutoFormData } from "../schemas/produtoSchema";

// —— Tipos ————————————————————————————————————————————————————
export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  categoriaId: string;
  categoria?: { id: string; nome: string; icone: string; cor: string };
  ultimaMovimentacao: string;
  criadoEm: string;
  foto?: string | null;
};

type ProductsState = { produtos: Produto[]; isLoading: boolean; error: string | null };
type ProductsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Produto[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

// —— Reducer ——————————————————————————————————————————————————
function reducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, isLoading: true, error: null };
    case "LOAD_SUCCESS":
      return { produtos: action.payload, isLoading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case "UPDATE":
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE":
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

// —— Context + Provider ———————————————————————————————————————
const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    produtos: [],
    isLoading: true, // Começa carregando
    error: null,
  });

  // —— Carregar produtos da API ——————————————————————————————
  const carregarProdutos = useCallback(async () => {
    dispatch({ type: "LOAD_START" });
    try {
      const { data } = await api.get<Produto[]>("/produtos");
      dispatch({ type: "LOAD_SUCCESS", payload: data });
    } catch (error: any) {
      dispatch({ type: "LOAD_ERROR", payload: error.message });
    }
  }, []);

  // Carrega ao montar — o JWT já está no interceptor
  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  // —— Criar ——————————————————————————————————————————————————
  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const { data: novo } = await api.post<Produto>("/produtos", data);
    dispatch({ type: "ADD", payload: novo });
  }, []);

  // —— Editar ————————————————————————————————————————————————
  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const { data: atualizado } = await api.put<Produto>(`/produtos/${id}`, data);
    dispatch({ type: "UPDATE", payload: atualizado });
  }, []);

  // —— Deletar ———————————————————————————————————————————————
  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((p) => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        error: state.error,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        deletarProduto,
        getProdutoById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return ctx;
}
