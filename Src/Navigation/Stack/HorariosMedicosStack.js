import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListarHorariosMedicos from '../../../Screen/HorariosMedicos/listarHorariosMedicos';
import EditarHorariosMedicos from '../../../Screen/HorariosMedicos/editarHorariosMedicos';

const Stack = createStackNavigator();

export default function HorariosMedicosStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ListarHorariosMedicos"
                component={ListarHorariosMedicos}
                options={{ title: 'Horarios Médicos' }}
            />
            <Stack.Screen
                name="EditarHorariosMedicos"
                component={EditarHorariosMedicos}
                options={{ title: 'Editar Horario' }}
            />
        </Stack.Navigator>
    );
}