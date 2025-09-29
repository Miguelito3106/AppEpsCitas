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
      console.log("🔐 Iniciando login con:", email);
      
      const response = await api.post('/login', {
        email,
        password
      });
      
      console.log("✅ Respuesta completa del login:", response);
      console.log("📊 Datos recibidos:", response.data);
      
      // MANEJO MEJORADO DE LA RESPUESTA
      if (response.data.access_token) {
        const userData = response.data.user || {
          id: response.data.user?.id,
          name: response.data.user?.name,
          email: response.data.user?.email,
          role: response.data.user?.role,
          especialidad: response.data.user?.especialidad,
          telefono: response.data.user?.telefono,
          fecha_nacimiento: response.data.user?.fecha_nacimiento
        };

        // Guardar en storage seguro
        await SafeStorage.setItem('user', JSON.stringify(userData));
        await SafeStorage.setItem('userToken', response.data.access_token);
        
        console.log("💾 Usuario guardado:", userData);
        console.log("🔑 Token guardado:", response.data.access_token);
        
        return {
          user: userData,
          token: response.data.access_token,
          access_token: response.data.access_token,
          token_type: response.data.token_type
        };
      } else {
        console.error("❌ Estructura de respuesta incorrecta:", response.data);
        throw new Error('Estructura de respuesta del servidor incorrecta');
      }
      
    } catch (error) {
      console.error("💥 Error completo en login:", error);
      console.error("📨 Error response:", error.response);
      console.error("📊 Error data:", error.response?.data);
      
      let errorMessage = 'Error de conexión';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      // ENVIAR TODOS LOS CAMPOS REQUERIDOS
      const completeUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password,
        role: userData.role,
        telefono: userData.telefono || '0000000000',
        fecha_nacimiento: userData.fecha_nacimiento || '1990-01-01'
      };

      // Solo agregar especialidad si es médico
      if (userData.role === 'medico' && userData.especialidad) {
        completeUserData.especialidad = userData.especialidad;
      }

      console.log("Datos de registro (completos):", completeUserData);

      const response = await api.post('/register', completeUserData);
      
      console.log("Respuesta del registro:", response.data);
      
      if (response.data.access_token && response.data.user) {
        await SafeStorage.setItem('user', JSON.stringify(response.data.user));
        await SafeStorage.setItem('userToken', response.data.access_token);
        
        return {
          user: response.data.user,
          token: response.data.access_token
        };
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
      const token = await SafeStorage.getItem('userToken');
      
      if (userData && token) {
        const user = JSON.parse(userData);
        console.log("Usuario recuperado:", user);
        return user;
      }
      console.log("No hay usuario en sesión");
      return null;
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
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: async () => {
    try {
      const token = await SafeStorage.getItem('userToken');
      const user = await SafeStorage.getItem('user');
      return !!(token && user);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  // Función para actualizar datos del usuario localmente
  updateLocalUser: async (updatedUserData) => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const mergedUser = { ...currentUser, ...updatedUserData };
        await SafeStorage.setItem('user', JSON.stringify(mergedUser));
        console.log("Usuario actualizado localmente:", mergedUser);
        return mergedUser;
      }
      return null;
    } catch (error) {
      console.error('Error actualizando usuario local:', error);
      return null;
    }
  }
};

// Función específica para registro
export const registerUser = async (name, email, password, role = 'paciente', especialidad = null, telefono = '0000000000', fecha_nacimiento = '1990-01-01') => {
  try {
    const userData = {
      name,
      email,
      password,
      role,
      especialidad: role === 'medico' ? especialidad : null,
      telefono,
      fecha_nacimiento
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