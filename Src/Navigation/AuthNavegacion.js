import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../../Screen/login/login"
import Register from "../../Screen/login/registrar"
import React from 'react';

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
    </Stack.Navigator>
  )
}