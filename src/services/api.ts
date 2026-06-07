import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configura o IP de Wi-Fi local descoberto do Windows (192.168.1.114)
const BASE_URL = __DEV__
  ? "http://192.168.1.114:3333/api"
  : "https://proestoque-api.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Evento global para escutar expiração de sessão e forçar logout na UI
export const apiEvents = {
  onSignOut: () => {},
};

// Interceptor de Request: Adiciona o access token JWT em toda chamada automaticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Controle de concorrência e fila para atualização de tokens expirados (Bônus)
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Interceptor de Response: Trata erros globais (Ex: se retornar 401, tenta renovar via Refresh Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 (Não autorizado/Token Expirado) e a requisição ainda não foi reenviada
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("@proestoque:refresh_token");

        if (!refreshToken) {
          throw new Error("Nenhum refresh token encontrado no AsyncStorage");
        }

        // Renova os tokens chamando POST /auth/refresh
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Salva os novos tokens no storage
        await AsyncStorage.multiSet([
          ["@proestoque:token", newAccessToken],
          ["@proestoque:refresh_token", newRefreshToken],
        ]);

        // Atualiza cabeçalhos globais e da requisição original
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Se falhar a renovação, limpa a sessão localmente
        await AsyncStorage.multiRemove([
          "@proestoque:token",
          "@proestoque:user",
          "@proestoque:refresh_token",
        ]);

        // Notifica o AuthContext para deslogar a interface do usuário
        apiEvents.onSignOut();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
