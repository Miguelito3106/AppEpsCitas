import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarHorariosMedicos from "../../../Screen/HorariosMedicos/listarHorariosMedicos";
import EditarHorariosMedicos from "../../../Screen/HorariosMedicos/editarHorariosMedicos";

const Stack = createStackNavigator();

const HorariosMedicosStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="listarHorariosMedicos"
        component={ListarHorariosMedicos}
        options={{ title: "Horario Medicos" }}
      />
      <Stack.Screen
        name="actualizarHorariosMedicos"
        component={ EditarHorariosMedicos }
        options={{ title: "Editar Médico" }}
      />
    </Stack.Navigator>
  )
}
export default HorariosMedicosStack;