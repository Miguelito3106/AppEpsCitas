import { NavigationContainer } from "@react-navigation/native"
import AuthNavegacion from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from "react"
import { AppState, View, ActivityIndicator } from "react-native"

// Componente Text seguro para web
const SafeText = ({ children, style }) => {
  return React.createElement('span', { 
    style: {
      fontFamily: 'System',
      fontSize: 14,
      color: '#666',
      ...style
    }
  }, children);
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
      console.log("Token cargado:", token);
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

  // Se ejecuta cuando hay cambio de estado de la app 
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("La aplicación ha vuelto al primer plano, verificando token...");
        loadToken();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        {/* Usar SafeText en lugar de Text para evitar errores en web */}
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