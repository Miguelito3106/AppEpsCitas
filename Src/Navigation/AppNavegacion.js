import { NavigationContainer } from "@react-navigation/native"
import AuthNavegacion from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from "react"
import { AppState, View, ActivityIndicator } from "react-native"

export default function AppNavegacion() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const appState = useRef(AppState.currentState);

  const loadToken = async () => {
    try {
      // Para DEBUG: Limpiar el token al cargar (opcional)
      // await AsyncStorage.removeItem("userToken");
      
      const token = await AsyncStorage.getItem("userToken");
      console.log("🔑 Token cargado:", token ? "SÍ existe" : "NO existe");
      setUserToken(token);
    } catch (error) {
      console.error("❌ Error al cargar el token:", error);
      setUserToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar token al iniciar (para testing)
  const clearTokenOnStart = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      console.log("🗑️ Token limpiado al iniciar");
    } catch (error) {
      console.error("Error al limpiar token:", error);
    }
  };

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    // Opcional: Descomenta la siguiente línea para limpiar el token al iniciar
    // clearTokenOnStart();
    
    loadToken();
  }, []);

  // Se ejecuta cuando hay cambio de estado de la app 
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("🔄 La aplicación ha vuelto al primer plano, verificando token...");
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
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando...</Text>
      </View>
    );
  }

  console.log("🎯 Estado actual - Mostrando:", userToken ? "INICIO" : "LOGIN");

  return (
    <NavigationContainer>
      {userToken ? <NavegacionPrincipal /> : <AuthNavegacion />}
    </NavigationContainer>
  );
}