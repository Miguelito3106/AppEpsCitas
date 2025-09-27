import { NavigationContainer } from "@react-navigation/native"
import AuthNavegacion from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from "react"
import { AppState, View, ActivityIndicator } from "react-native"

// Componente Text seguro para web - MEJORADO
const SafeText = ({ children, style }) => {
  // Verificar si estamos en web o móvil
  const isWeb = typeof document !== 'undefined';
  
  if (isWeb) {
    return React.createElement('span', { 
      style: {
        fontFamily: 'System, -apple-system, sans-serif',
        fontSize: 14,
        color: '#666',
        ...style
      }
    }, children);
  } else {
    // En móvil, usar el Text nativo de React Native
    const { Text } = require('react-native');
    return <Text style={[{ fontSize: 14, color: '#666' }, style]}>{children}</Text>;
  }
};

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const appState = useRef(AppState.currentState);

  const loadToken = async () => {
    try {
      // Limpiar token para testing (descomenta si necesitas)
      // await AsyncStorage.removeItem("userToken");
      
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token cargado:", token ? "SÍ" : "NO");
      setUserToken(token);
    } catch (error) {
      console.error("Error al cargar el token:", error);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    loadToken();
  }, []);

  // Se ejecuta cuando hay cambio de estado de la app - CORREGIDO
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("La aplicación ha vuelto al primer plano, verificando token...");
        loadToken();
      }
      appState.current = nextAppState;
    };

    // Manejo compatible con diferentes versiones de React Native
    let subscription;
    if (AppState.addEventListener) {
      // Versiones más recientes
      subscription = AppState.addEventListener("change", handleAppStateChange);
    } else {
      // Versiones más antiguas (backward compatibility)
      subscription = AppState.addEventListener("change", handleAppStateChange);
    }
    
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else if (AppState.removeEventListener) {
        // Fallback para versiones antiguas
        AppState.removeEventListener("change", handleAppStateChange);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <SafeText style={{ marginTop: 10 }}>Cargando...</SafeText>
      </View>
    );
  }

  console.log("Estado actual - userToken:", userToken ? "SÍ" : "NO");

  return (
    <NavigationContainer>
      {userToken ? <NavegacionPrincipal /> : <AuthNavegacion />}
    </NavigationContainer>
  );
}