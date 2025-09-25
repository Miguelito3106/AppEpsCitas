import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarPacientes from "../../../Screen/Pacientes/listarPacientes";
import EditarPacientes from "../../../Screen/Pacientes/editarPacientes";

const Stack = createStackNavigator();

const PacientesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pacientes"
        component={ListarPacientes}
        options={{ title: "Pacientes" }}
      />
      <Stack.Screen
        name="EditarPacientes"
        component={EditarPacientes}
        options={{ title: "Editar Paciente" }}
      />
    </Stack.Navigator>
  );
};

export default PacientesStack;
