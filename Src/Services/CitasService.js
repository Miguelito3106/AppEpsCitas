import api from './conexion';

export const listarCitas = async () => {

  try {
    const response = await api.get('/listarcitas');
    return { succes: true, data: response.data };
    
  } catch (error) {
    console.error("Error al listar citas:", error);
    return { succes: false, message: 'Error al listar citas' };
  }
}

export const eliminarCita = async (id) => {
  try { 
    const response = await api.get(`/eliminarcita/${id}`);
    return { succes : true };
    
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return { succes: false, message: 'Error al eliminar cita' };
  }
}

export const crearCita = async (data)=>{
  try {
    const response = await api.post('/crearCita', data);
    return { succes: true, data: response.data };
    
  } catch (error) {
    console.error("Error al crear cita:", error);
    return { succes: false, message: 'Error al crear cita' };
  }
};
export const editarCita = async (id, data)=>{
  try {
    const response = await api.post(`/editarCita/${id}`, data);
    return { succes: true, data: response.data };
  } catch (error) {
    confirme.error("Error al editar cita:", error);
    return { succes: false, message: 'Error al editar cita'};
  }
};