import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../../Screen/login/login"
import Register from "../../Screen/login/registrar"
import inicio from "../../Screen/Inicio/inicio"
import detalleCitas from "../../Screen/Citas/detalleCitas"

const Stack = createNativeStackNavigator()

export default function AuthNavegacion() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" component={Login} options={{ title: "Iniciar Sesión" }} 
      />
      <Stack.Screen 
        name="Register" component={Register} options={{ title: "Registrar Usuario" }} 
      />
      <Stack.Screen 
        name="Inicio" component={inicio} options={{ title: "Panel Principal" }} 
      />
      <Stack.Screen 
        name="detalleCitas" component={detalleCitas} options={{ title: "Detalle de Cita" }} 
      />
    </Stack.Navigator>
  )
}
