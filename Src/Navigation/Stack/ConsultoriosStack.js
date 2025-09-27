import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarConsultorios from "../../../Screen/Consultorios/listarConsultorios";
import crearConsultorios from "../../../Screen/Consultorios/editarConsultorios";

const Stack = createStackNavigator();

const ConsultoriosStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="listarConsultorios"
        component={ ListarConsultorios }
        options={{ title: "Consultorios" }}
      />
      <Stack.Screen
        name="crearConsultorios"
        component={ crearConsultorios }
        options={{ title: "Agregar Consultorios" }}
      />

    </Stack.Navigator>
  );
};

export default ConsultoriosStack;
