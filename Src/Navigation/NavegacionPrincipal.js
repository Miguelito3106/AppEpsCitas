import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from "react"
import { View, Text } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'

// IMPORTACIONES CORREGIDAS
import Inicio from "../../Screen/Inicio/inicio"
import MedicosDashboard from "../../Screen/Medicos/MedicosDashboard"
import PacientesDashboard from "../../Screen/Pacientes/PacientesDashboard"

// IMPORTAR STACKS DESDE LA CARPETA STACK
import InicioStack from "./Stack/InicioStack"
import MedicosStack from "./Stack/MedicosStack"
import PacientesStack from "./Stack/PacientesStack"
import CitasStack from "./Stack/CitasStack"
import ConsultoriosStack from "./Stack/ConsultoriosStack"
import HorariosMedicosStack from "./Stack/HorariosMedicosStack"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Componente de fallback
const FallbackScreen = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title} - Módulo en desarrollo</Text>
  </View>
);

// Cargar componentes con manejo de errores
let PerfilComponent = () => <FallbackScreen title="Perfil" />;

try {
  const perfilModule = require("../../Screen/Perfil/PerfilScreen");
  PerfilComponent = perfilModule.default || perfilModule;
} catch (error) {
  console.warn("PerfilScreen no encontrado, usando fallback");
}

// Tab Navigator para Admin
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Medicos') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Pacientes') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Citas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
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
        component={InicioStack}
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="Medicos" 
        component={MedicosStack}
        options={{ 
          title: 'Médicos',
          tabBarLabel: 'Médicos'
        }} 
      />
      <Tab.Screen 
        name="Pacientes" 
        component={PacientesStack}
        options={{ 
          title: 'Pacientes',
          tabBarLabel: 'Pacientes'
        }} 
      />
      <Tab.Screen 
        name="Citas" 
        component={CitasStack}
        options={{ 
          title: 'Citas',
          tabBarLabel: 'Citas'
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilComponent}
        options={{ 
          title: 'Perfil',
          tabBarLabel: 'Mi Perfil'
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

          if (route.name === 'MedicoInicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MedicoCitas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MedicoPerfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="MedicoInicio" 
        component={MedicosDashboard}
        options={{ 
          title: 'Dashboard Médico',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="MedicoCitas" 
        component={CitasStack}
        options={{ 
          title: 'Mis Citas',
          tabBarLabel: 'Citas'
        }} 
      />
      <Tab.Screen 
        name="MedicoPerfil" 
        component={PerfilComponent}
        options={{ 
          title: 'Perfil Médico',
          tabBarLabel: 'Mi Perfil'
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

          if (route.name === 'PacienteInicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'PacienteCitas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'PacientePerfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc3545',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="PacienteInicio" 
        component={PacientesDashboard}
        options={{ 
          title: 'Dashboard Paciente',
          tabBarLabel: 'Inicio'
        }} 
      />
      <Tab.Screen 
        name="PacienteCitas" 
        component={CitasStack}
        options={{ 
          title: 'Mis Citas',
          tabBarLabel: 'Citas'
        }} 
      />
      <Tab.Screen 
        name="PacientePerfil" 
        component={PerfilComponent}
        options={{ 
          title: 'Perfil Paciente',
          tabBarLabel: 'Mi Perfil'
        }} 
      />
    </Tab.Navigator>
  )
}

export default function NavegacionPrincipal({ user }) {
  console.log("🎯 NavegacionPrincipal - Usuario:", user ? `${user.name} (${user.role})` : "No user");

  // Determinar el componente inicial basado en el rol
  const getInitialComponent = () => {
    if (!user) {
      console.log("❌ No hay usuario, redirigiendo a Auth");
      return null;
    }
    
    console.log("✅ Usuario con rol:", user.role);
    
    switch (user.role) {
      case 'admin':
        return AdminTabs;
      case 'medico':
        return MedicoTabs;
      case 'paciente':
        return PacienteTabs;
      default:
        console.log("⚠️ Rol no reconocido:", user.role, "usando AdminTabs");
        return AdminTabs;
    }
  };

  const InitialComponent = getInitialComponent();

  if (!InitialComponent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: No se pudo determinar la navegación</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={InitialComponent}
      />
      
      {/* Stacks accesibles para admin */}
      <Stack.Screen 
        name="ConsultoriosStack" 
        component={ConsultoriosStack}
        options={{ 
          headerShown: true,
          title: 'Consultorios'
        }} 
      />
      <Stack.Screen 
        name="HorariosMedicosStack" 
        component={HorariosMedicosStack}
        options={{ 
          headerShown: true,
          title: 'Horarios Médicos'
        }} 
      />
    </Stack.Navigator>
  )
}