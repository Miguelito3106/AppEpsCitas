import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './conexion';

export const loginUser = async (email, password) => {

    try {
        const response = await api.post('/login', {email, password});
        const  token = response.data.token;
        console.log("Respuesta del servidor:", response.data);
        console.log("Token recibido:", token);
        if(token){
            await AsyncStorage.setItem("userToken", token);
        }else{
            console.log("No se recibió un token en la respuesta.");
        }
        return {succes: true, token};
        
    } catch (error) {
        console.error("Error durante el login:", error.response ? error.response.data : error.message);

        return {
            succes: false,
            message: error.response ? error.response.data : "Error de red",
        };       
    } 

}

const registerUser = async (name, email, password) => {
  try {
    const response = await fetch('http://tu-api.com/api/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
        token: data.token,
        message: data.message
      };
    } else {
      return {
        success: false,
        message: data.message || data.errors || 'Error en el registro'
      };
    }
  } catch (error) {
    console.error('Error en registerUser:', error);
    return {
      success: false,
      message: 'Error de conexión. Intenta nuevamente.'
    };
  }
};