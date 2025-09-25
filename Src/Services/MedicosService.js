import api from './conexion';

export const listarMedicos = async () => {
    try {
       const response =  await api.get('/listarmedicos');
       return { succes : true, data: response.data };
        
    } catch (error) {
        console.error("Error al listar medico:", error);
        return { succes: false, message: 'Error al listar medicos' };
    }
}

export const elminarMedico = async (id) => {
     try {
      const response =  await api.get(`/eliminarmedicos/${id}`);
       return { succes : true };
        
    } catch (error) {
        console.error("Error al eliminar medico:", error);
        return { succes: false, message: 'Error al listar medico' };
    }
}

export const crearMedico = async (data)=>{
    try {
        const response = await api.post('/crearmedicos', data);
        return { succes: true, data: response.data };
        
    } catch (error) {
        console.error("Error al crear medico:", error);
        return { succes: false, message: 'Error al crear medico' };
        
    }
};
export const editarMedico = async (id, data)=>{
    try {
        const response = await api.post(`/editarmedicos/${id}`, data);
        return { succes: true, data: response.data };
    } catch (error) {
        console.error("Error al editar medico:", error);
        return { succes: false, message: 'Error al editar medico' };
    }
};