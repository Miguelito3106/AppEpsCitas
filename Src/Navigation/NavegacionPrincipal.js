// Src/Navigation/NavegacionPrincipal.js
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from "react"
import { View, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

// IMPORTACIONES CORREGIDAS CON LA ESTRUCTURA ACTUAL
import Inicio from "../../Screen/Inicio/inicio"
import MedicosDashboard from "../../Screen/Medicos/MedicosDashboard"
import PacientesDashboard from "../../Screen/Pacientes/PacientesDashboard"
import PerfilScreen from "../../Screen/Perfil/PerfilScreen"
import Configuracion from "../../Screen/Configuraciones/Configuraciones"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Componente de fallback si Configuracion no existe
const ConfiguracionFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Configuración - Módulo en desarrollo</Text>
  </View>
);

// Componente de fallback si PerfilScreen no existe
const PerfilFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Perfil - Módulo en desarrollo</Text>
  </View>
);

// Cargar componentes con manejo de errores
let ConfiguracionComponent = ConfiguracionFallback;
let PerfilComponent = PerfilFallback;

try {
  ConfiguracionComponent = require("../../Screen/Configuraciones/Confuguraciones").default;
} catch (error) {
  console.warn("Configuracion no encontrado, usando fallback");
}

try {
  PerfilComponent = require("../../Screen/PerfilScreen").default;
} catch (error) {
  console.warn("PerfilScreen no encontrado, usando fallback");
}

// Tab Navigator para Admin (usa tu inicio.js)
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Configuracion') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={Inicio} 
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          title: 'Perfil',
          tabBarLabel: 'Mi Perfil'
        }} 
      />
      <Tab.Screen 
        name="Configuracion" 
        component={Configuracion} 
        options={{ 
          title: 'Configuración',
          tabBarLabel: 'Configuración'
        }} 
      />
    </Tab.Navigator>
  )
}

// Tab Navigator para Médico
function MedicoTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'MedicoDashboard') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Configuracion') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="MedicoDashboard" 
        component={MedicosDashboard} 
        options={{ 
          title: 'Dashboard Médico',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          title: 'Perfil Médico',
          tabBarLabel: 'Mi Perfil'
        }} 
      />
      <Tab.Screen 
        name="Configuracion" 
        component={Configuracion} 
        options={{ 
          title: 'Configuración',
          tabBarLabel: 'Configuración'
        }} 
      />
    </Tab.Navigator>
  )
}

// Tab Navigator para Paciente
function PacienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PacienteDashboard') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Configuracion') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc3545',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="PacienteDashboard" 
        component={PacientesDashboard} 
        options={{ 
          title: 'Dashboard Paciente',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          title: 'Perfil Paciente',
          tabBarLabel: 'Mi Perfil'
        }} 
      />
      <Tab.Screen 
        name="Configuracion" 
        component={Configuracion} 
        options={{ 
          title: 'Configuración',
          tabBarLabel: 'Configuración'
        }} 
      />
    </Tab.Navigator>
  )
}

export default function NavegacionPrincipal({ user }) {
  // Determinar el componente inicial basado en el rol
  const getInitialComponent = () => {
    if (!user) {
      console.log("No hay usuario, redirigiendo a pantalla de inicio genérica");
      return Inicio;
    }
    
    console.log("Usuario con rol:", user.role, "redirigiendo a tabs correspondientes");
    
    switch (user.role) {
      case 'admin':
        return AdminTabs;
      case 'medico':
        return MedicoTabs;
      case 'paciente':
        return PacienteTabs;
      default:
        console.log("Rol no reconocido:", user.role, "usando inicio genérico");
        return Inicio;
    }
  };

  const InitialComponent = getInitialComponent();

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={InitialComponent}
        options={{
          headerShown: false
        }}
      />
      
      {/* Pantallas accesibles para todos los roles (pantallas individuales) */}
      <Stack.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ 
          headerShown: true,
          title: 'Mi Perfil'
        }} 
      />
      <Stack.Screen 
        name="Configuracion" 
        component={Configuracion} 
        options={{ 
          headerShown: true,
          title: 'Configuración'
        }} 
      />
      
      {/* Dashboards específicos por rol (para navegación directa) */}
      <Stack.Screen 
        name="MedicoDashboard" 
        component={MedicosDashboard} 
        options={{ 
          headerShown: true,
          title: 'Dashboard Médico'
        }} 
      />
      <Stack.Screen 
        name="PacienteDashboard" 
        component={PacientesDashboard} 
        options={{ 
          headerShown: true,
          title: 'Dashboard Paciente'
        }} 
      />
    </Stack.Navigator>
  )
}