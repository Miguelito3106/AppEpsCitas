import api from './conexion';

export const listarConsultorios = async () => {
    try {
       const response = await api.get('/listarconsultorios');
       return { success: true, data: response.data };
        
    } catch (error) {
        console.error("Error al listar consultorios:", error);
        return { success: false, message: 'Error al listar consultorios' };
    }
}

export const eliminarConsultorios = async (id) => {
     try {
      const response = await api.delete(`/eliminarconsultorios/${id}`);
       return { success: true };
        
    } catch (error) {
        console.error("Error al eliminar consultorios:", error);
        return { success: false, message: 'Error al eliminar consultorios' };
    }
}

export const crearConsultorios = async (data) => {
    try {
        console.log('📤 Enviando datos a Laravel:', data);
        
        const response = await api.post('/crearconsultorios', data);
        return { success: true, data: response.data };
        
    } catch (error) {
        console.error("Error completo al crear consultorios:", error);
        
        // MOSTRAR ERRORES ESPECÍFICOS DE LARAVEL
        if (error.response?.data) {
            console.log('🚨 Error details from Laravel:', error.response.data);
            return { 
                success: false, 
                message: JSON.stringify(error.response.data) 
            };
        }
        
        return { 
            success: false, 
            message: 'Error al crear consultorios' 
        };
    }
};

export const editarConsultorios = async (id, data) => {
    try {
        console.log('📤 Enviando datos para editar:', {id, data});
        
        const response = await api.put(`/editarconsultorios/${id}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error completo al editar consultorios:", error);
        
        // MOSTRAR ERRORES ESPECÍFICOS DE LARAVEL
        if (error.response?.data) {
            console.log('🚨 Error details from Laravel:', error.response.data);
            return { 
                success: false, 
                message: JSON.stringify(error.response.data) 
            };
        }
        
        return { 
            success: false, 
            message: 'Error al editar consultorios' 
        };
    }
};