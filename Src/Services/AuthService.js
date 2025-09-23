import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './conexion';

export const loginUser = async (email, password) => {
    try {
        console.log("📡 Enviando solicitud de login...");
        const response = await api.post('/login', {email, password});
        
        console.log("✅ Respuesta del servidor recibida:", response.data);
        const token = response.data.token;
        
        if(token){
            console.log("🔐 Token recibido, guardando...");
            await AsyncStorage.setItem("userToken", token);
            
            // Verificar que se guardó correctamente
            const savedToken = await AsyncStorage.getItem("userToken");
            console.log("💾 Token guardado verificado:", savedToken ? "SÍ" : "NO");
            
            return {success: true, token};
        } else {
            console.log("❌ No se recibió token en la respuesta");
            return {
                success: false,
                message: "No se recibió token del servidor"
            };
        }
        
    } catch (error) {
        console.error("❌ Error durante el login:", error.response ? error.response.data : error.message);

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