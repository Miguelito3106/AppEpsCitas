import api from './conexion';

export const listarConsultorios = async () => {
    try {
       const response =  await api.get('/listarconsultorios');
       return { succes : true, data: response.data };
        
    } catch (error) {
        console.error("Error al listar consultorios:", error);
        return { succes: false, message: 'Error al listar consultorios' };
    }
}

export const eliminarconsultorios = async (id) => {
     try {
      const response =  await api.get(`/eliminarconsultorios/${id}`);
       return { succes : true };
        
    } catch (error) {
        console.error("Error al eliminar consultorios:", error);
        return { succes: false, message: 'Error al listar consultorios' };
    }
}

export const crearConsultorios = async (data)=>{
    try {
        const response = await api.post('/crearconsultorios', data);
        return { succes: true, data: response.data };
        
    } catch (error) {
        console.error("Error al crear consultorios:", error);
        return { succes: false, message: 'Error al crear consultorios' };
        
    }
};
export const editarConsultorios = async (id, data)=>{
    try {
        const response = await api.post(`/editarconsultorios/${id}`, data);
        return { succes: true, data: response.data };
    } catch (error) {
        console.error("Error al editar consultorios:", error);
        return { succes: false, message: 'Error al editar consultorios' };
    }
};