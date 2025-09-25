import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity,Alert,ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearPaciente, editarPaciente } from '../../Src/Services/PacienteService';

export default function EditarPacientes() {
    const navigation = useNavigation();
    const route = useRoute();

    const paciente  = route.params?.paciente;

    const [nombre, setNombre] = useState(paciente ? paciente.nombre : '');
    const [apellido, setApellido] = useState(paciente ? String(paciente.apellido) : '');
    const [documento, setDocumento] = useState(paciente ? paciente.documento : '');
    const [telefono, setTelefono] = useState(paciente ? paciente.telefono : '');
    const [genero, setGenero] = useState(paciente ? paciente.genero : '');
    const [loading, setLoading] = useState(false);

    const esEdicion = !!paciente;

    const handleGuardar = async ()=>{
        if (!nombre || !apellido || !documento || !telefono || !genero) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }
        setLoading(true);
        try {
            let result;
            if (esEdicion) {
                result = await editarPaciente(paciente.id,
                     { nombre, 
                        apellido,
                         documento, 
                        telefono,
                         genero
                        });
            }else {
                result = await crearPaciente({ nombre, apellido, documento, telefono, genero });
            }
            if (result.succes) {
                Alert.alert('Éxito', `Paciente ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
                navigation.goBack(); // Volver a la pantalla anterior
            } else {
                Alert.alert('Error', result.message || 'Hubo un problema al guardar el paciente.');
            }

    }catch (error) {
        Alert.alert('Error', 'Hubo un problema al guardar el paciente.');
    } finally {
        setLoading(false);
    }
}

return(
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
             <Text style={styles.title}>{esEdicion ? 'Editar Paciente' : 'Crear Paciente'}</Text>
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
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}  
                    keyboardType="phone-pad"
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Género"
                    value={genero}
                    onChangeText={setGenero}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
                    </TouchableOpacity>
         </View>


    </ScrollView>
)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F6FF", // fondo más suave
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E3A8A", // azul oscuro
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
    borderColor: "#CBD5E1", // gris suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // efecto en Android
  },
  boton: {
    backgroundColor: "#2563EB", // azul vibrante
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 14,
    color: "#475569", // gris medio
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626", // rojo para errores
    marginBottom: 8,
  },
});
