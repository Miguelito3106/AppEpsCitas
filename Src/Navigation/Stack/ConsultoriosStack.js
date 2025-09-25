import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarConsultorios from "../../Screen/Consultorios/listarConsultorios";
import crearConsultorios from "../../Screen/Consultorios/editarConsultorios";

const Stack = createStackNavigator();

const PacientesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Consultorios"
        component={ListarConsultorios}
        options={{ title: "Pacientes" }}
      />
      <Stack.Screen
        name="CreaarConsultorios"
        component={crearConsultorios}
        options={{ title: "Agregar Consultorios" }}
      />

    </Stack.Navigator>
  );
};

export default PacientesStack;
