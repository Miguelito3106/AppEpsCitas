import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../../Screen/login/login"
import Register from "../../Screen/login/registrar"
import NavegacionPrincipal from "./NavegacionPrincipal" // ✅ Ruta correcta

const Stack = createNativeStackNavigator()

export default function AuthNavegacion() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      
      {/* ✅ LÍNEA AGREGADA - Registrar MainTabs */}
      <Stack.Screen name="MainTabs" component={NavegacionPrincipal} />
    </Stack.Navigator>
  )
}