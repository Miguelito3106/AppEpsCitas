import api from './conexion';

export const listarHorariosMedicos = async () => {
    try {
       const response = await api.get('/horarios-medicos');
       return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al listar horarios:", error);
        return { success: false, message: 'Error al listar horarios' };
    }
}

export const eliminarHorariosMedicos = async (id) => {
     try {
      await api.delete(`/horarios-medicos/${id}`);
       return { success: true };
    } catch (error) {
        console.error("Error al eliminar horario:", error);
        return { success: false, message: 'Error al eliminar horario' };
    }
}

export const crearHorariosMedicos = async (data) => {
    try {
        const response = await api.post('/horarios-medicos', data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al crear horario:", error);
        return { success: false, message: 'Error al crear horario' };
    }
};

export const actualizarHorariosMedicos = async (id, data) => {
    try {
        const response = await api.put(`/horarios-medicos/${id}`, data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error al editar horario:", error);
        return { success: false, message: 'Error al editar horario' };
    }
};