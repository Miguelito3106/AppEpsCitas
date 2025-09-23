import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './src/views/HomeScreen';
import ExchangeRatesScreen from './src/views/ExchangeRatesScreen';
import CalculatorScreen from './src/views/CalculatorScreen';
import HistoryScreen from './src/views/HistoryScreen';
import AppointmentsScreen from './src/views/AppointmentsScreen';
import CreateAppointmentScreen from './src/views/CreateAppointmentScreen';
import AppointmentDetailScreen from './src/views/AppointmentDetailScreen';

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
        <Stack.Screen 
          name="Appointments" 
          component={AppointmentsScreen}
          options={{ title: 'Mis Citas' }}
        />
        <Stack.Screen 
          name="CreateAppointment" 
          component={CreateAppointmentScreen}
          options={{ title: 'Agendar Cita' }}
        />
        <Stack.Screen 
          name="AppointmentDetail" 
          component={AppointmentDetailScreen}
          options={{ title: 'Detalle de Cita' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}