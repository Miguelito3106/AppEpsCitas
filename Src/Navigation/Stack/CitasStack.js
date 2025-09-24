import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitas from "../../../Screen/Citas/listarCitas";
import CrearCita from "../../../Screen/Citas/EditarCitas";

const Stack = createStackNavigator();

const CitasStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="Citas"
        component={ListarCitas}
        options={{ title: "Citas" }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCita}
        options={{ title: "Agregar Cita" }}
      />
    </Stack.Navigator>
  )
}
export default CitasStack;