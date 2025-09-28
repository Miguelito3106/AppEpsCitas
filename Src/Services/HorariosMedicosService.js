import api from './conexion';

export const ListarHorariosMedicos = async () => {
    try {
       const response =  await api.get('/listarhorarios');
       return { succes : true, data: response.data };
        
    } catch (error) {
        console.error("Error al listar pacientes:", error);
        return { succes: false, message: 'Error al listar pacientes' };
    }
}

export const eliminarHorariosMedicos = async (id) => {
     try {
      const response =  await api.delete(`/eliminarhorarios/${id}`);
       return { succes : true };
        
    } catch (error) {
        console.error("Error al eliminar pacientes:", error);
        return { succes: false, message: 'Error al listar pacientes' };
    }
}

export const crearHorariosMedicos = async (data)=>{
    try {
        const response = await api.post('/crearhorarios', data);
        return { succes: true, data: response.data };
        
    } catch (error) {
        console.error("Error al crear paciente:", error);
        return { succes: false, message: 'Error al crear paciente' };
        
    }
};
export const EditarHorariosMedicos = async (id, data)=>{
    try {
        const response = await api.put(`/editarhorarios/${id}`, data);
        return { succes: true, data: response.data };
    } catch (error) {
        console.error("Error al editar paciente:", error);
        return { succes: false, message: 'Error al editar paciente' };
    }
};