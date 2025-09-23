import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 
const API_URL = 'http://127.0.0.1:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const RutasPublicas = ['/login', '/register'];


api.interceptors.request.use(
  async (config) => {
    const EsRutaPublica = RutasPublicas.some(ruta => config.url?.includes(ruta));
    let userToken = null;

    if (!EsRutaPublica) {
     
      userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config) {
      const originalRequest = error.config;
      const isRutaPublica = RutasPublicas.some(ruta => originalRequest.url?.includes(ruta));

      if (error.response && error.response.status === 401 && !originalRequest._retry && !isRutaPublica) {
        originalRequest._retry = true;
        await AsyncStorage.removeItem("userToken");
        console.log("⚠️ Token expirado o no autorizado, redireccionando a login...");
      }
    } else {
      console.error("Error de red o sin config:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
