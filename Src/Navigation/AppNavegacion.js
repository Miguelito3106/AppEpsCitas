import { NavigationContainer } from "@react-navigation/native";
import AuthNavegacion from "./AuthNavegacion";
import NavegacionPrincipal from "./NavegacionPrincipal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from "react";
import { AppState, View, ActivityIndicator, Text, Platform } from "react-native";

// SafeStorage para compatibilidad web/móvil
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

// ✅ Función para forzar actualización global del estado de usuario
const updateUserState = async (setUserFunction, newUser = null) => {
  try {
    if (newUser) {
      setUserFunction(newUser);
      console.log("🔄 Estado de usuario actualizado:", newUser.role);
    } else {
      const userData = await SafeStorage.getItem("user");
      const userToken = await SafeStorage.getItem("userToken");
      
      if (userData && userToken) {
        const parsedUser = JSON.parse(userData);
        setUserFunction(parsedUser);
        console.log("🔄 Usuario recuperado del storage:", parsedUser.role);
      } else {
        setUserFunction(null);
        console.log("🔄 No hay usuario en sesión");
      }
    }
  } catch (error) {
    console.error("❌ Error actualizando estado:", error);
    setUserFunction(null);
  }
};

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const appState = useRef(AppState.currentState);

  // ✅ Función loadUser mejorada
  const loadUser = async () => {
    try {
      console.log("🔄 Cargando usuario desde storage...");
      
      const userData = await SafeStorage.getItem("user");
      const userToken = await SafeStorage.getItem("userToken");

      console.log("📱 Usuario en storage:", userData ? "SÍ" : "NO");
      console.log("🔑 Token en storage:", userToken ? "SÍ" : "NO");
      
      if (userData && userToken) {
        const user = JSON.parse(userData);
        console.log("✅ Usuario cargado:", user);
        setUser(user);
      } else {
        console.log("❌ No hay usuario logueado");
        setUser(null);
        
        // Limpiar datos inconsistentes
        if (userData && !userToken) {
          await SafeStorage.removeItem("user");
          console.log("🧹 Datos inconsistentes limpiados");
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar el usuario:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("🏁 Carga de usuario completada");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("🔄 La aplicación ha vuelto al primer plano, verificando usuario...");
        loadUser();
      }
      appState.current = nextAppState;
    };

    let subscription;
    if (AppState.addEventListener) {
      subscription = AppState.addEventListener("change", handleAppStateChange);
    } else {
      subscription = AppState.addEventListener("change", handleAppStateChange);
    }

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else if (AppState.removeEventListener) {
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, []);

  // ✅ Escuchar cambios en el storage (para web)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleStorageChange = () => {
        console.log("🔄 Cambio detectado en storage, recargando usuario...");
        loadUser();
      };

      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
          Cargando...
        </Text>
      </View>
    );
  }

  console.log("🎯 Estado actual - usuario:", user ? `SÍ (${user.role})` : "NO");

  return (
    <NavigationContainer>
      {user ? <NavegacionPrincipal user={user} /> : <AuthNavegacion />}
    </NavigationContainer>
  );
}

// ✅ Exportar funciones para que otros componentes puedan usarlas
export { SafeStorage, updateUserState };