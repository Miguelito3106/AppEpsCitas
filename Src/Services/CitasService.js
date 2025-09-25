import api from './conexion';

// Listar todas las citas
export const listarCitas = async () => {
  try {
    const response = await api.get('/listarcitas');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al listar citas:", error);
    return { success: false, message: 'Error al listar citas' };
  }
};

// Eliminar una cita
export const EliminarCita = async (id) => {
  try { 
    await api.delete(`/eliminarcitas/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return { success: false, message: 'Error al eliminar cita' };
  }
};

// Crear una nueva cita
export const crearCita = async (data) => {
  try {
    const response = await api.post('/crearcitas', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear cita:", error);
    return { success: false, message: 'Error al crear cita' };
  }
};

// Editar una cita
export const editarCita = async (id, data) => {
  try {
    const response = await api.put(`/editarcitas/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al editar cita:", error);
    return { success: false, message: 'Error al editar cita' };
  }
};
