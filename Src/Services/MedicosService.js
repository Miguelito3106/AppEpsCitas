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

// ✅ crear médico (CORREGIDO)
export const crearMedico = async (data) => {
  try {
    console.log('Datos enviados al crear médico:', data);
    
    const response = await api.post('/crearmedicos', data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al crear médico:", error);
    
    // Manejo mejorado de errores
    if (error.response && error.response.status === 422) {
      const errorData = error.response.data;
      console.log("Errores de validación:", errorData);
      
      if (errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstErrorMessage = errorData.errors[firstErrorKey][0];
        return { 
          success: false, 
          message: firstErrorMessage || 'Error de validación',
          validationErrors: errorData.errors
        };
      }
      
      if (errorData.message) {
        return { 
          success: false, 
          message: errorData.message 
        };
      }
    }
    
    return { 
      success: false, 
      message: error.message || 'Error al crear médico' 
    }; 
  }
};

// ✅ editar médico
export const editarMedico = async (id, data) => {
  try {
    const response = await api.put(`/editarmedicos/${id}`, data);
    return { success: true, data: response.data }; 
  } catch (error) {
    console.error("Error al editar médico:", error);
    
    if (error.response && error.response.status === 422) {
      const errorData = error.response.data;
      
      if (errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        const firstErrorMessage = errorData.errors[firstErrorKey][0];
        return { 
          success: false, 
          message: firstErrorMessage || 'Error de validación'
        };
      }
    }
    
    return { 
      success: false, 
      message: error.message || 'Error al editar médico' 
    }; 
  }
};