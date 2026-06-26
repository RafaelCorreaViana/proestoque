import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, apiEvents } from "../services/api";

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEYS = {
  TOKEN:         "@proestoque:token",
  REFRESH_TOKEN: "@proestoque:refresh_token",
  USER:          "@proestoque:user",
} as const;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // Escuta evento de deslogar vindo do interceptor da API (Ex: refresh token expirado)
  useEffect(() => {
    apiEvents.onSignOut = () => {
      setToken(null);
      setUser(null);
    };
  }, []);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const [tokenSalvo, userString] = await AsyncStorage.multiGet([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER,
        ]);

        const token = tokenSalvo[1];
        const user = userString[1] ? JSON.parse(userString[1]) : null;

        if (token && user) {
          setToken(token);
          setUser(user);
        }
      } catch (error) {
        console.warn("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Delay visual mínimo de 1.5s para carregamento do SplashScreen
    const timeoutId = setTimeout(() => {
      carregarSessao();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    try {
      if (!email || !senha) throw new Error("Preencha todos os campos");

      const response = await api.post("/auth/login", { email, senha });
      const { usuario, token, refreshToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? "E-mail ou senha inválidos";
      throw new Error(mensagem);
    }
  }, []);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    try {
      if (!nome || !email || !senha) throw new Error("Preencha todos os campos");

      const response = await api.post("/auth/registro", { nome, email, senha });
      const { usuario, token, refreshToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);

      setToken(token);
      setUser(usuario);
    } catch (error: any) {
      const mensagem = error.response?.data?.erro ?? "Erro ao criar conta";
      throw new Error(mensagem);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER
      ]);
      setToken(null);
      setUser(null);
    } finally {
      // Nothing needed here
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}
