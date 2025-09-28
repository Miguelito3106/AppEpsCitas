import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarConsultorios from "../../../Screen/Consultorios/listarConsultorios";
import EditarConsultorios from "../../../Screen/Consultorios/editarConsultorios";

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
        name="EditarConsultorios"
        component={ EditarConsultorios }
        options={{ title: "Editar Consultorios " }}
      />

    </Stack.Navigator>
  );
};

export default ConsultoriosStack;
