import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { obtenerCitaPorId, eliminarCita } from '../../Src/Services/CitasService';

const DetalleCitas = ({ route, navigation }) => {
  const { citaId } = route.params;
  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarCita = async () => {
    try {
      const citaData = await obtenerCitaPorId(citaId);
      setCita(citaData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la cita');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCita();
  }, [citaId]);

  const manejarEliminar = () => {
    Alert.alert(
      'Eliminar Cita',
      `¿Estás seguro de eliminar la cita de ${cita?.paciente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarCita(citaId);
              Alert.alert('Éxito', 'Cita eliminada correctamente');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la cita');
            }
          },
        },
      ]
    );
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <Text>Cargando cita...</Text>
      </View>
    );
  }

  if (!cita) {
    return (
      <View style={styles.centrado}>
        <Text>Cita no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Detalle de Cita</Text>
      </View>

      <View style={styles.tarjetaDetalle}>
        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Paciente:</Text>
          <Text style={styles.valor}>{cita.paciente}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Médico:</Text>
          <Text style={styles.valor}>{cita.medico}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Especialidad:</Text>
          <Text style={styles.valor}>{cita.especialidad}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Consultorio:</Text>
          <Text style={styles.valor}>{cita.consultorio}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Fecha:</Text>
          <Text style={styles.valor}>{formatearFecha(cita.fecha)}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Hora:</Text>
          <Text style={styles.valor}>{cita.hora}</Text>
        </View>

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Estado:</Text>
          <Text style={[styles.valor, styles.estado]}>{cita.estado}</Text>
        </View>

        {cita.notas && (
          <View style={styles.filaDetalle}>
            <Text style={styles.etiqueta}>Notas:</Text>
            <Text style={styles.valor}>{cita.notas}</Text>
          </View>
        )}

        <View style={styles.filaDetalle}>
          <Text style={styles.etiqueta}>Creada el:</Text>
          <Text style={styles.valor}>
            {new Date(cita.createdAt).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      <View style={styles.botonesAccion}>
        <TouchableOpacity 
          style={styles.botonEditar}
          onPress={() => navigation.navigate('EditarCitas', { citaId: cita.id })}
        >
          <Text style={styles.textoBoton}>Editar Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonEliminar}
          onPress={manejarEliminar}
        >
          <Text style={styles.textoBoton}>Eliminar Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tarjetaDetalle: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  valor: {
    fontSize: 16,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  estado: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  botonesAccion: {
    padding: 15,
  },
  botonEditar: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonEliminar: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetalleCitas;