import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  RefreshControl 
} from 'react-native';
import { obtenerCitas, eliminarCita } from '../../Src/Services/CitasService';

const ListarCitas = ({ navigation }) => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargarCitas = async () => {
    try {
      const citasData = await obtenerCitas();
      setCitas(citasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const manejarRefrescar = () => {
    setRefrescando(true);
    cargarCitas();
  };

  const manejarEliminarCita = (id, paciente) => {
    Alert.alert(
      'Eliminar Cita',
      `¿Estás seguro de eliminar la cita de ${paciente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarCita(id);
              await cargarCitas();
              Alert.alert('Éxito', 'Cita eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la cita');
            }
          },
        },
      ]
    );
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada': return '#4CAF50';
      case 'pendiente': return '#FF9800';
      case 'cancelada': return '#F44336';
      case 'completada': return '#2196F3';
      default: return '#757575';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderItemCita = ({ item }) => (
    <TouchableOpacity 
      style={styles.tarjetaCita}
      onPress={() => navigation.navigate('DetalleCitas', { citaId: item.id })}
    >
      <View style={styles.cabeceraTarjeta}>
        <Text style={styles.nombrePaciente}>{item.paciente}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: obtenerColorEstado(item.estado) }]}>
          <Text style={styles.textoEstado}>{item.estado}</Text>
        </View>
      </View>
      
      <Text style={styles.medico}>{item.medico}</Text>
      <Text style={styles.especialidad}>{item.especialidad}</Text>
      
      <View style={styles.infoCita}>
        <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
        <Text style={styles.hora}>{item.hora}</Text>
      </View>
      
      <Text style={styles.consultorio}>{item.consultorio}</Text>
      
      <View style={styles.botonesAccion}>
        <TouchableOpacity 
          style={styles.botonVer}
          onPress={() => navigation.navigate('DetalleCitas', { citaId: item.id })}
        >
          <Text style={styles.textoBotonVer}>Ver Detalles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.botonEditar}
          onPress={() => navigation.navigate('EditarCitas', { citaId: item.id })}
        >
          <Text style={styles.textoBotonEditar}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.botonEliminar}
          onPress={() => manejarEliminarCita(item.id, item.paciente)}
        >
          <Text style={styles.textoBotonEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Mis Citas Médicas</Text>
        <TouchableOpacity 
          style={styles.botonAgregar}
          onPress={() => navigation.navigate('EditarCitas', { citaId: null })}
        >
          <Text style={styles.textoBotonAgregar}>+ Nueva Cita</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={citas}
        renderItem={renderItemCita}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={manejarRefrescar} />
        }
        ListEmptyComponent={
          <View style={styles.listaVacia}>
            <Text style={styles.textoListaVacia}>No hay citas programadas</Text>
            <TouchableOpacity 
              style={styles.botonAgregarPrimera}
              onPress={() => navigation.navigate('EditarCitas', { citaId: null })}
            >
              <Text style={styles.textoBotonAgregarPrimera}>Agendar primera cita</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cabecera: {
    backgroundColor: '#2196F3',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  botonAgregar: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoBotonAgregar: {
    color: 'white',
    fontWeight: 'bold',
  },
  tarjetaCita: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cabeceraTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nombrePaciente: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  textoEstado: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  medico: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  especialidad: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  infoCita: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  hora: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  consultorio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonVer: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  textoBotonVer: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botonEditar: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  textoBotonEditar: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  textoBotonEliminar: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listaVacia: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  textoListaVacia: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  botonAgregarPrimera: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textoBotonAgregarPrimera: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListarCitas;