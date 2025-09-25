import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearMedico, editarMedico } from '../../Src/Services/MedicosService';

export default function EditarMedicoScreen() {   // 🔥 Nombre cambiado
  const navigation = useNavigation();
  const route = useRoute();

  const paciente = route.params?.paciente || null;

  const [nombre, setNombre] = useState(paciente ? paciente.nombre : '');
  const [apellido, setApellido] = useState(paciente ? String(paciente.apellido) : '');
  const [documento, setDocumento] = useState(paciente ? paciente.documento : '');
  const [email, setEmail] = useState(paciente ? paciente.email : '');
  const [telefono, setTelefono] = useState(paciente ? paciente.telefono : '');
  const [loading, setLoading] = useState(false);

  const esEdicion = !!paciente;

  const handleGuardar = async () => {
    if (!nombre || !apellido || !documento || !email || !telefono) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    setLoading(true);
    try {
      let result;
      if (esEdicion) {
        result = await editarMedico(paciente.id, {
          nombre,
          apellido,
          documento,
          email,
          telefono,
        });
      } else {
        result = await crearMedico({
          nombre,
          apellido,
          documento,
          email,
          telefono,
        });
      }

      if (result.success) {   // 🔥 corregido
        Alert.alert('Éxito', `Médico ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message || 'Hubo un problema al guardar el médico.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar el médico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{esEdicion ? 'Editar Médico' : 'Crear Médico'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
        <TextInput
          style={styles.input}
          placeholder="Documento"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F6FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E3A8A",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {  // 🔥 corregido
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {  // 🔥 corregido
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
