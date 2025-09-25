import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarMedicos from "../../../Screen/Medicos/listarMedicos";
import EditarMedico from "../../../Screen/Medicos/editarMedicos";

const Stack = createStackNavigator();

const PacientesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarMedicos"
        component={ListarMedicos}
        options={{ title: "Medicos" }}
      />
      <Stack.Screen
        name="EditarMedico"
        component={EditarMedico}
        options={{ title: "Editar Medicos " }}
      />

    </Stack.Navigator>
  );
};

export default PacientesStack;
