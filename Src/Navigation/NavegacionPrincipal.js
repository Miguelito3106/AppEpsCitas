import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "../../Screen/Inicio/inicio"; 
import CitasStack from "./Stack/CitasStack"; 
import PerfilScreen from "../../Screen/Perfil/PerfilScreen";

const Stack = createNativeStackNavigator();

export default function NavegacionPrincipal() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={Inicio}
        options={{ title: "Panel Principal" }}
      />

      <Stack.Screen
        name="Citas"
        component={CitasStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Perfil de Usuario" }}
      />
    </Stack.Navigator>
  );
}
