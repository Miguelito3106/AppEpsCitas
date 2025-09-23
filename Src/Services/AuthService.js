import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './conexion';

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', {email, password});
        const token = response.data.token;
        
        if(token){
            await AsyncStorage.setItem("userToken", token);
            return {success: true, token};
        } else {
            return {
                success: false,
                message: "No se recibió token del servidor"
            };
        }
    } catch (error) {
        console.error("Error durante el login:", error);

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