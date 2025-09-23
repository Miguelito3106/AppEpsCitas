import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// Corrige las rutas de importación según tu estructura real
import HomeScreen from './Screen/Inicio/inicio'; // Ruta corregida
//import ExchangeRatesScreen from './Screen/ExchangeRatesScreen'; // Debes crear este archivo
//import CalculatorScreen from './Screen/CalculatorScreen'; // Debes crear este archivo
//import HistoryScreen from './Screen/HistoryScreen'; // Debes crear este archivo

// Para citas, usa la estructura que ya tienes
import ListarCitas from './Screen/Citas/listarCitas';
import DetalleCitas from './Screen/Citas/detalleCitas';
import EditarCitas from './Screen/Citas/editarCitas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'EPS Cambios y Citas' }}
        />
        <Stack.Screen 
          name="ExchangeRates" 
          component={ExchangeRatesScreen}
          options={{ title: 'Tasas de Cambio' }}
        />
        <Stack.Screen 
          name="Calculator" 
          component={CalculatorScreen}
          options={{ title: 'Calculadora' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Historial' }}
        />
        {/* Pantallas de Citas - usando tus archivos existentes */}
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
    </NavigationContainer>
  );
}