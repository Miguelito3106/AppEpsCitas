import { NavigationContainer } from "@react-navigation/native"
import AuthNavegacion from "./AuthNavegacion"
import NavegacionPrincipal from "./NavegacionPrincipal"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef, use,} from "react"
import { AppState } from "react-native"

export default function AppNavegacion() {

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const appState = useRef(AppState.currentState);

  const loadToken = async ()=>{
    try{
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    }catch(error){
      console.error("Error al cargar el token:", error);
    }finally{
      setIsLoading(false);
    }
  };

    // se ejecuta cuando el componente se monta
  useEffect(()=>{
    loadToken();
  },[])
    // se ejecuta cuando hay  cambio de estado de la app 
  useEffect(()=>{
    const handleAppStateChange = (nextAppState)=>{
      if(appState.current.match(/inactive|bacckground/) && nextAppState === "active"){
        console.log ("la apliciopn ha vuelto al primer plano, verificando el token...");
        loadToken();
      }
      appState.current = nextAppState;

    };
    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return() =>subscription.remove();

  },[]);

  //se ejecuta en un intervalo de 2 segundos
  useEffect(()=>{
    const interval = setInterval(()=>{

    },2000);
    return ()=> clearInterval(interval);

  },[])

  return (
    <NavigationContainer>
     {userToken ?<NavegacionPrincipal /> : <AuthNavegacion />}
    </NavigationContainer>
  );
}
