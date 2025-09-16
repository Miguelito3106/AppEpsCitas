import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Iconicons, Feather, materialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function NavegacionPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#f9f9f9',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#222',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
      }}
    >
      <Tab.screen
        name="inicio"
        component={Inicio}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Iconicons name="home" color={color} size={size} />
          ),
          tabBArLabel: 'Inicio',
        }}
      />

      <Tab.screen
        name="Perfil"
        component={PerfilesScreen}
        option={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" color={color} size={size} />
          ),
          tabBArLabel: 'Perfil',
        }}
      />

      <Tab.screen
        name="Configuraciones"
        component={ConfiguracionStack}
        option={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Iconicons name="cog-outline" color={color} size={size} />
          ),
          tabBArLabel: 'Configuracion',
        }}
      />
    </Tab.Navigator>
  );
}
