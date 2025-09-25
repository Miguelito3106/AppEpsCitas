import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "../../Screen/Inicio/inicio"; 
import CitasStack from "./Stack/CitasStack"; 
import PerfilScreen from "../../Screen/Perfil/PerfilScreen";
import PacientesStack from "./Stack/PacientesStack";
import MedicosStack from "./Stack/MedicosStack"

const Stack = createNativeStackNavigator();

export default function NavegacionPrincipal() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#007BFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={Inicio}
        options={{ title: "Panel Principal" }}
      />

      <Stack.Screen
        name="Citas"
        component={CitasStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Perfil de Usuario" }}
      />

      <Stack.Screen
        name="Pacientes"
        component={PacientesStack}
        options={{ title: "Perfil de Usuario" }}
      />
       <Stack.Screen
        name="Medicos"
        component={MedicosStack}
        options={{ title: "Perfil de Usuario" }}
      />
    </Stack.Navigator>
  );
}
