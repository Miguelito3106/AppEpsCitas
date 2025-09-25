import api from './conexion';

// ✅ listar médicos
export const listarMedicos = async () => {
  try {
    const response = await api.get('/listarmedicos');
    return { success: true, data: response.data }; 
  } catch (error) {
    console.error("Error al listar médicos:", error);
    return { success: false, message: 'Error al listar médicos' }; 
  }
};

// ✅ eliminar médico
export const eliminarMedico = async (id) => {
  try {
    await api.delete(`/eliminarmedicos/${id}`);
    return { success: true }; 
  } catch (error) {
    console.error("Error al eliminar médico:", error);
    return { success: false, message: 'Error al eliminar médico' };
  }
};

// ✅ crear médico
export const crearMedico = async (data) => {
  try {
    const response = await api.post('/crearmedicos', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear médico:", error);
    return { success: false, message: 'Error al crear médico' }; 
  }
};

// ✅ editar médico
export const editarMedico = async (id, data) => {
  try {
    const response = await api.put(`/editarmedicos/${id}`, data);
    return { success: true, data: response.data }; 
  } catch (error) {
    console.error("Error al editar médico:", error);
    return { success: false, message: 'Error al editar médico' }; 
  }
};
