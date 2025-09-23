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
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token cargado:", token);
      setUserToken(token);
    } catch (error) {
      console.error("Error al cargar el token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Escuchar cambios en el almacenamiento
  useEffect(() => {
    const checkTokenChange = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token !== userToken) {
        setUserToken(token);
      }
    };

    const interval = setInterval(checkTokenChange, 1000);
    return () => clearInterval(interval);
  }, [userToken]);

  // Se ejecuta cuando el componente se monta
  useEffect(() => {
    loadToken();
  }, []);

  // Se ejecuta cuando hay cambio de estado de la app 
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("La aplicación ha vuelto al primer plano, verificando el token...");
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
        <Text style={{ marginTop: 10 }}>Cargando...</Text>
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