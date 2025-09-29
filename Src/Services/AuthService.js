// Src/Services/AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from './conexion';

// Storage seguro para web/móvil
const SafeStorage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
  multiRemove: async (keys) => {
    if (Platform.OS === 'web') {
      keys.forEach(key => localStorage.removeItem(key));
    } else {
      await AsyncStorage.multiRemove(keys);
    }
  }
};

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      console.log("Respuesta del login:", response.data);
      
      if (response.data.access_token) {
        // Guardar en storage seguro
        await SafeStorage.setItem('user', JSON.stringify(response.data.user));
        await SafeStorage.setItem('userToken', response.data.access_token);
        
        console.log("Usuario guardado:", response.data.user);
        console.log("Token guardado");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  register: async (userData) => {
    try {
      // ENVIAR TODOS LOS CAMPOS REQUERIDOS
      const completeUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password, // IMPORTANTE: agregar este campo
        role: userData.role,
        telefono: userData.telefono || '0000000000', // Valor por defecto
        fecha_nacimiento: userData.fecha_nacimiento || '1990-01-01' // Valor por defecto
      };

      // Solo agregar especialidad si es médico
      if (userData.role === 'medico' && userData.especialidad) {
        completeUserData.especialidad = userData.especialidad;
      }

      console.log("Datos de registro (completos):", completeUserData);

      const response = await api.post('/register', completeUserData);
      
      console.log("Respuesta del registro:", response.data);
      
      if (response.data.access_token) {
        await SafeStorage.setItem('user', JSON.stringify(response.data.user));
        await SafeStorage.setItem('userToken', response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error.response?.data || error.message);
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  logout: async () => {
    try {
      // Intentar hacer logout en el servidor
      await api.post('/logout');
    } catch (error) {
      console.error('Error en logout del servidor:', error);
    } finally {
      // Siempre limpiar el almacenamiento
      await SafeStorage.multiRemove(['user', 'userToken']);
      console.log("Sesión cerrada");
    }
  },

  getCurrentUser: async () => {
    try {
      const userData = await SafeStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  getToken: async () => {
    try {
      return await SafeStorage.getItem('userToken');
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }
};

// Función específica para registro - VERSIÓN CORREGIDA
export const registerUser = async (name, email, password, role = 'paciente', especialidad = null, telefono = '0000000000', fecha_nacimiento = '1990-01-01') => {
  try {
    const userData = {
      name,
      email,
      password,
      role,
      especialidad: role === 'medico' ? especialidad : null,
      telefono, // Ahora con valor por defecto
      fecha_nacimiento // Ahora con valor por defecto
    };

    console.log("Datos de registro:", userData);

    const result = await authService.register(userData);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error en registerUser:", error);
    return { 
      success: false, 
      message: error.message || 'Error en el registro' 
    };
  }
};

export default authService;