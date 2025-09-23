import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Picker 
} from 'react-native';
import { 
  obtenerCitaPorId, 
  crearCita, 
  actualizarCita 
} from '../../Src/Services/CitasService';

const EditarCitas = ({ route, navigation }) => {
  const { citaId } = route.params;
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    paciente: '',
    medico: '',
    especialidad: 'Medicina General',
    consultorio: '',
    fecha: '',
    hora: '09:00',
    estado: 'pendiente',
    notas: ''
  });

  const especialidades = [
    'Medicina General',
    'Pediatría',
    'Cardiología',
    'Dermatología',
    'Ginecología',
    'Ortopedia',
    'Oftalmología',
    'Odontología',
    'Psicología'
  ];

  const horasDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const estados = ['pendiente', 'confirmada', 'cancelada', 'completada'];

  useEffect(() => {
    if (citaId) {
      cargarCitaExistente();
    }
  }, [citaId]);

  const cargarCitaExistente = async () => {
    try {
      const cita = await obtenerCitaPorId(citaId);
      if (cita) {
        setFormulario(cita);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la cita');
    }
  };

  const manejarCambio = (campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const validarFormulario = () => {
    if (!formulario.paciente.trim()) {
      Alert.alert('Error', 'El nombre del paciente es requerido');
      return false;
    }
    if (!formulario.medico.trim()) {
      Alert.alert('Error', 'El nombre del médico es requerido');
      return false;
    }
    if (!formulario.consultorio.trim()) {
      Alert.alert('Error', 'El consultorio es requerido');
      return false;
    }
    if (!formulario.fecha) {
      Alert.alert('Error', 'La fecha es requerida');
      return false;
    }
    return true;
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      if (citaId) {
        // Actualizar cita existente
        await actualizarCita(citaId, formulario);
        Alert.alert('Éxito', 'Cita actualizada correctamente');
      } else {
        // Crear nueva cita
        await crearCita(formulario);
        Alert.alert('Éxito', 'Cita creada correctamente');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la cita');
    } finally {
      setCargando(false);
    }
  };

  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>
          {citaId ? 'Editar Cita' : 'Nueva Cita'}
        </Text>
      </View>

      <View style={styles.formulario}>
        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Paciente *</Text>
          <TextInput
            style={styles.input}
            value={formulario.paciente}
            onChangeText={(texto) => manejarCambio('paciente', texto)}
            placeholder="Nombre completo del paciente"
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Médico *</Text>
          <TextInput
            style={styles.input}
            value={formulario.medico}
            onChangeText={(texto) => manejarCambio('medico', texto)}
            placeholder="Nombre del médico"
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Especialidad</Text>
          <Picker
            selectedValue={formulario.especialidad}
            style={styles.picker}
            onValueChange={(valor) => manejarCambio('especialidad', valor)}
          >
            {especialidades.map(especialidad => (
              <Picker.Item key={especialidad} label={especialidad} value={especialidad} />
            ))}
          </Picker>
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Consultorio *</Text>
          <TextInput
            style={styles.input}
            value={formulario.consultorio}
            onChangeText={(texto) => manejarCambio('consultorio', texto)}
            placeholder="Número o nombre del consultorio"
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Fecha *</Text>
          <TextInput
            style={styles.input}
            value={formulario.fecha}
            onChangeText={(texto) => manejarCambio('fecha', texto)}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
          />
          <Text style={styles.ayuda}>Formato: AAAA-MM-DD (ej: 2024-09-25)</Text>
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Hora</Text>
          <Picker
            selectedValue={formulario.hora}
            style={styles.picker}
            onValueChange={(valor) => manejarCambio('hora', valor)}
          >
            {horasDisponibles.map(hora => (
              <Picker.Item key={hora} label={hora} value={hora} />
            ))}
          </Picker>
        </View>

        {citaId && (
          <View style={styles.grupoInput}>
            <Text style={styles.etiqueta}>Estado</Text>
            <Picker
              selectedValue={formulario.estado}
              style={styles.picker}
              onValueChange={(valor) => manejarCambio('estado', valor)}
            >
              {estados.map(estado => (
                <Picker.Item key={estado} label={estado} value={estado} />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.grupoInput}>
          <Text style={styles.etiqueta}>Notas</Text>
          <TextInput
            style={[styles.input, styles.areaTexto]}
            value={formulario.notas}
            onChangeText={(texto) => manejarCambio('notas', texto)}
            placeholder="Observaciones o síntomas..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.botonGuardar, cargando && styles.botonDeshabilitado]}
          onPress={manejarGuardar}
          disabled={cargando}
        >
          <Text style={styles.textoBotonGuardar}>
            {cargando ? 'Guardando...' : (citaId ? 'Actualizar Cita' : 'Crear Cita')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonCancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotonCancelar}>Cancelar</Text>
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
  formulario: {
    padding: 20,
  },
  grupoInput: {
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  areaTexto: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  ayuda: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  botonGuardar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonDeshabilitado: {
    backgroundColor: '#cccccc',
  },
  textoBotonGuardar: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonCancelar: {
    backgroundColor: '#757575',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonCancelar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarCitas;