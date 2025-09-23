import AsyncStorage from '@react-native-async-storage/async-storage';

const CITAS_KEY = 'citas_medicas';

// Datos de ejemplo para empezar
const citasEjemplo = [
  {
    id: '1',
    paciente: 'Juan Pérez',
    medico: 'Dr. Carlos Rodríguez',
    especialidad: 'Medicina General',
    consultorio: 'Consultorio 101',
    fecha: '2024-09-25',
    hora: '10:00',
    estado: 'confirmada',
    notas: 'Consulta de rutina',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    paciente: 'María García',
    medico: 'Dra. Ana López',
    especialidad: 'Pediatría',
    consultorio: 'Consultorio 205',
    fecha: '2024-09-26',
    hora: '14:30',
    estado: 'pendiente',
    notas: 'Control mensual',
    createdAt: new Date().toISOString()
  }
];

// CREATE - Crear nueva cita
export const crearCita = async (citaData) => {
  try {
    const citas = await obtenerCitas();
    const nuevaCita = {
      id: Date.now().toString(),
      ...citaData,
      createdAt: new Date().toISOString(),
      estado: 'pendiente'
    };
    
    const citasActualizadas = [...citas, nuevaCita];
    await AsyncStorage.setItem(CITAS_KEY, JSON.stringify(citasActualizadas));
    return nuevaCita;
  } catch (error) {
    console.error('Error creando cita:', error);
    throw error;
  }
};

// READ - Obtener todas las citas
export const obtenerCitas = async () => {
  try {
    const citas = await AsyncStorage.getItem(CITAS_KEY);
    if (!citas) {
      // Si no hay citas, inicializar con datos de ejemplo
      await AsyncStorage.setItem(CITAS_KEY, JSON.stringify(citasEjemplo));
      return citasEjemplo;
    }
    return JSON.parse(citas);
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    return [];
  }
};

// READ - Obtener cita por ID
export const obtenerCitaPorId = async (id) => {
  try {
    const citas = await obtenerCitas();
    return citas.find(cita => cita.id === id);
  } catch (error) {
    console.error('Error obteniendo cita por ID:', error);
    return null;
  }
};

// UPDATE - Actualizar cita
export const actualizarCita = async (id, datosActualizados) => {
  try {
    const citas = await obtenerCitas();
    const citasActualizadas = citas.map(cita =>
      cita.id === id 
        ? { ...cita, ...datosActualizados, updatedAt: new Date().toISOString() }
        : cita
    );
    
    await AsyncStorage.setItem(CITAS_KEY, JSON.stringify(citasActualizadas));
    return citasActualizadas.find(cita => cita.id === id);
  } catch (error) {
    console.error('Error actualizando cita:', error);
    throw error;
  }
};

// DELETE - Eliminar cita
export const eliminarCita = async (id) => {
  try {
    const citas = await obtenerCitas();
    const citasFiltradas = citas.filter(cita => cita.id !== id);
    await AsyncStorage.setItem(CITAS_KEY, JSON.stringify(citasFiltradas));
    return true;
  } catch (error) {
    console.error('Error eliminando cita:', error);
    throw error;
  }
};

// Obtener citas por estado
export const obtenerCitasPorEstado = async (estado) => {
  try {
    const citas = await obtenerCitas();
    return citas.filter(cita => cita.estado === estado);
  } catch (error) {
    console.error('Error filtrando citas por estado:', error);
    return [];
  }
};

// Obtener citas próximas
export const obtenerCitasProximas = async () => {
  try {
    const citas = await obtenerCitas();
    const hoy = new Date();
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fecha);
      return fechaCita >= hoy;
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } catch (error) {
    console.error('Error obteniendo citas próximas:', error);
    return [];
  }
};