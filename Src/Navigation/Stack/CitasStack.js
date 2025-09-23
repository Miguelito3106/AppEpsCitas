import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListarCitas from "../../../Screen/Citas/listarCitas";
import CrearCita from "../../../Screen/Citas/CrearCitas";
const Stack = createNativeStackNavigator();

export default function CitasStack() {
  return (
    <Stack.Navigator
      initialRouteName="ListarCitas"
      screenOptions={{
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="ListarCitas"
        component={ListarCitas}
        options={{ title: "Citas" }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCita}
        options={{ title: "Nueva Cita" }}
      />
    </Stack.Navigator>
  );
}
