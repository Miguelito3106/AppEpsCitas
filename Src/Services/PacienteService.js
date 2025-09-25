import api from './conexion';

export const listarPacientes = async () => {
    try {
       const response =  await api.get('/listarpacientes');
       return { succes : true, data: response.data };
        
    } catch (error) {
        console.error("Error al listar pacientes:", error);
        return { succes: false, message: 'Error al listar pacientes' };
    }
}

export const EliminarPaciente = async (id) => {
     try {
      const response =  await api.delete(`/eliminarpacientes/${id}`);
       return { succes : true };
        
    } catch (error) {
        console.error("Error al eliminar pacientes:", error);
        return { succes: false, message: 'Error al listar pacientes' };
    }
}

export const crearPaciente = async (data)=>{
    try {
        const response = await api.post('/crearpacientes', data);
        return { succes: true, data: response.data };
        
    } catch (error) {
        console.error("Error al crear paciente:", error);
        return { succes: false, message: 'Error al crear paciente' };
        
    }
};
export const editarPaciente = async (id, data)=>{
    try {
        const response = await api.put(`/editarpacientes/${id}`, data);
        return { succes: true, data: response.data };
    } catch (error) {
        console.error("Error al editar paciente:", error);
        return { succes: false, message: 'Error al editar paciente' };
    }
};