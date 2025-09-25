import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarMedico from "../../../Screen/Medicos/listarMedicos";
import crearMedico from "../../../Screen/Medicos/editarMedicos";

const Stack = createStackNavigator();

const PacientesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Medicos"
        component={ListarMedico}
        options={{ title: "Medicos" }}
      />
      <Stack.Screen
        name="CrearMedicos"
        component={crearMedico}
        options={{ title: "Agregar Medicos" }}
      />

    </Stack.Navigator>
  );
};

export default PacientesStack;
