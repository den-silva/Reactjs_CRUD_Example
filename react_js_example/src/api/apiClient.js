import axios from 'axios';

// Configuração base da API - PORTAS CORRETAS do seu backend
const apiClient = axios.create({
  baseURL: 'https://localhost:7255/api', // HTTPS ou use 'http://localhost:5185/api'
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (se necessário)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erros da API
      console.error('Erro da API:', error.response.data);
      
      switch (error.response.status) {
        case 400:
          console.error('Requisição inválida:', error.response.data);
          break;
        case 401:
          console.error('Não autorizado');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acesso proibido');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 409:
          console.error('Conflito (CPF/Email já cadastrado):', error.response.data);
          break;
        case 500:
          console.error('Erro interno do servidor:', error.response.data);
          break;
        default:
          console.error('Erro desconhecido');
      }
    } else if (error.request) {
      // Erro de rede
      console.error('Erro de rede: Não foi possível conectar à API');
      console.error('Verifique se o backend está rodando em:', apiClient.defaults.baseURL);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;