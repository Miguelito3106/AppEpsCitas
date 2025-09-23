import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListarCitas from '../../../Screen/Citas/listarCitas';
import DetalleCitas from '../../../Screen/Citas/detalleCitas';
import EditarCitas from '../../../Screen/Citas/editarCitas';

const Stack = createNativeStackNavigator();

const CitasStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ListarCitas" 
        component={ListarCitas}
        options={{ title: 'Mis Citas Médicas' }}
      />
      <Stack.Screen 
        name="DetalleCitas" 
        component={DetalleCitas}
        options={{ title: 'Detalle de Cita' }}
      />
      <Stack.Screen 
        name="EditarCitas" 
        component={EditarCitas}
        options={{ title: 'Editar Cita' }}
      />
    </Stack.Navigator>
  );
};

export default CitasStack;