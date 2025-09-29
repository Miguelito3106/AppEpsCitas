// Src/Navigation/AppNavegacion.js
import { NavigationContainer } from "@react-navigation/native"
import AuthNavegacion from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from "react"
import { AppState, View, ActivityIndicator, Text, Platform } from "react-native"

// IMPORTACIONES CORREGIDAS - Usando los nombres exactos de las carpetas
import MedicoDashboard from "../../Screen/Medicos/MedicosDashboard";
import PacienteDashboard from "../../Screen/Pacientes/PacientesDashboard";

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

// Componente de navegación principal actualizado
const NavegacionPrincipalActualizada = ({ user }) => {
  // Aquí deberías actualizar tu NavegacionPrincipal existente
  // para que redirija a los dashboards correctos según el rol
  return <NavegacionPrincipal user={user} />;
};

// Navegación alternativa que maneja los dashboards por rol
const NavegacionPorRol = ({ user }) => {
  const [initialRoute, setInitialRoute] = useState("Inicio");

  useEffect(() => {
    // Determinar la ruta inicial basada en el rol
    switch (user?.role) {
      case 'admin':
        setInitialRoute("inicio");
        break;
      case 'medico':
        setInitialRoute("MedicosDashboard");
        break;
      case 'paciente':
        setInitialRoute("PacientesDashboard");
        break;
      default:
        setInitialRoute("Inicio");
    }
  }, [user]);

  // Si estás usando NavegacionPrincipal, asegúrate de que maneje los roles
  // O puedes crear una navegación específica aquí
  return <NavegacionPrincipal user={user} initialRoute={initialRoute} />;
};

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const appState = useRef(AppState.currentState);

  const loadUser = async () => {
    try {
      const userData = await SafeStorage.getItem("user");
      const userToken = await SafeStorage.getItem("userToken");
      
      console.log("Plataforma:", Platform.OS);
      console.log("Usuario cargado:", userData ? "SÍ" : "NO");
      console.log("Token cargado:", userToken ? "SÍ" : "NO");
      
      if (userData && userToken) {
        const user = JSON.parse(userData);
        setUser(user);
        console.log("Rol del usuario:", user.role);
        console.log("Redirigiendo a dashboard de:", user.role);
      } else {
        setUser(null);
        // Limpiar datos inconsistentes
        if (userData && !userToken) {
          await SafeStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return; // No usar AppState en web
    
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("La aplicación ha vuelto al primer plano, verificando usuario...");
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10, fontSize: 14, color: '#666' }}>Cargando...</Text>
      </View>
    );
  }

  console.log("Estado actual - usuario:", user ? `SÍ (${user.role})` : "NO");

  return (
    <NavigationContainer>
      {user ? <NavegacionPorRol user={user} /> : <AuthNavegacion />}
    </NavigationContainer>
  );
}