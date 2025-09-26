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

export default function EditarMedico() {  
  const navigation = useNavigation();
  const route = useRoute();

  const medico = route.params?.medico;

  const [nombre, setNombre] = useState(medico ? medico.nombre : '');
  const [apellido, setApellido] = useState(medico ? String(medico.apellido) : '');
  const [documento, setDocumento] = useState(medico ? medico.documento : '');
  const [email, setEmail] = useState(medico ? medico.email : '');
  const [telefono, setTelefono] = useState(medico ? medico.telefono : '');
  const [loading, setLoading] = useState(false);

  const esEdicion = !!medico;

  const handleGuardar = async () => {
    // Validación de campos requeridos
    if (!nombre.trim() || !apellido.trim() || !documento.trim() || !email.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingrese un email válido.');
      return;
    }

    setLoading(true);
    try {
      let result;
      
      if (esEdicion) {
        // Para edición - enviar solo los campos básicos
        result = await editarMedico(medico.id, {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          documento: documento.trim(),
          telefono: telefono.trim(),
          email: email.trim(),
        });
      } else {
        // Para creación - enviar TODOS los campos que el backend requiere
        const medicoData = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          documento: documento.trim(),
          telefono: telefono.trim(),
          email: email.trim(), // Para la tabla medicos
          user_email: email.trim(), // Para la tabla users (mismo email)
          user_password: 'Password123' // Password por defecto
        };

        console.log('📤 Enviando datos al backend:', medicoData);
        result = await crearMedico(medicoData);
      }

      if (result.success) {   
        Alert.alert('Éxito', `Médico ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message || 'Hubo un problema al guardar el médico.');
      }
    } catch (error) {
      console.error('Error en handleGuardar:', error);
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
          placeholder="Nombre *"
          value={nombre}
          onChangeText={setNombre}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido *"
          value={apellido}
          onChangeText={setApellido}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Documento *"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono *"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          editable={!loading}
        />

        {!esEdicion && (
          <Text style={styles.infoText}>
            * Se creará automáticamente un usuario con este email y password por defecto
          </Text>
        )}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleGuardar} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
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
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  button: { 
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  cancelButton: {
    backgroundColor: "#6B7280",
  },
  buttonText: {  
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});