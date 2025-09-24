import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarPacientes from "../../../Screen/Pacientes/listarPacientes";
import crearPaciente from "../../../Screen/Pacientes/editarPacientes";

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
        name="CrearPaciente"
        component={crearPaciente}
        options={{ title: "Agregar Paciente" }}
      />

    </Stack.Navigator>
  );
};

export default PacientesStack;
