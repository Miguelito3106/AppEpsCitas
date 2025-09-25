import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitas from "../../../Screen/Citas/listarCitas";
import EditarCitas from "../../../Screen/Citas/EditarCitas";

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
        name="EditarCitas"
        component={EditarCitas}
        options={{ title: "Editar citas" }}
      />
    </Stack.Navigator>
  )
}
export default CitasStack;