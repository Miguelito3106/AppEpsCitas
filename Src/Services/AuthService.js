import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './conexion';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', {email, password});
        const token = response.data.token;
        console.log("Respuesta del servidor:", response.data);
        console.log("Token recibido:", token);
        
        if(token){
            await AsyncStorage.setItem("userToken", token);
            return {success: true, token};
        } else {
            console.log("No se recibió un token en la respuesta.");
            return {
                success: false,
                message: "No se recibió token del servidor"
            };
        }
        
    } catch (error) {
        console.error("Error durante el login:", error.response ? error.response.data : error.message);

        let errorMessage = "Error de conexión";
        if (error.response) {
            errorMessage = error.response.data.message || "Error en el servidor";
        }

        return {
            success: false,
            message: errorMessage,
        };       
    } 
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await api.post('/registrar', {
      name: name,
      email: email,
      password: password,
    });

    const data = response.data;

    if (response.status === 200 || response.status === 201) {
      if (data.token) {
        await AsyncStorage.setItem("userToken", data.token);
      }
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
      message: error.response?.data?.message || 'Error de conexión. Intenta nuevamente.'
    };
  }
};