import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inicio from '../../../Screen/Inicio/inicio'; // Ajusta la ruta según tu proyecto
import PacientesStack from "./PacientesStack";
import CitasStack from "./CitasStack";
import ConsultoriosStack from "./ConsultoriosStack";
import HorariosMedicosStack from "./HorariosMedicosStack";
import MedicosStack from "./MedicosStack";

const Stack = createNativeStackNavigator();

export default function InicioStack() {
    return (
        <Stack.Navigator 
            initialRouteName="inicio"
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen
                name="inicio"
                component={Inicio}
                options={{ title: "Inicio" }}
            />
            <Stack.Screen
                name="HorariosMedicosStack"
                component={HorariosMedicosStack}
                options={{ title: "Horarios Médicos" }}
              
            />
            <Stack.Screen
                name="CitasStack"
                component={CitasStack}
                options={{ title: "Citas Médicas" }}
            />
            <Stack.Screen
                name="ConsultoriosStack"
                component={ConsultoriosStack}
                options={{ title: "Consultorios" }}
            />
            <Stack.Screen
                name="MedicosStack"
                component={MedicosStack}
                options={{ title: "Médicos" }}
            />
            <Stack.Screen
                name="PacientesStack"
                component={PacientesStack}
                options={{ title: "Pacientes" }}
            />
        </Stack.Navigator>
    );
}