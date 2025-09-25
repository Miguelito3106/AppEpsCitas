import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity,Alert,ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearConsultorios, editarConsultorios } from '../../Src/Services/ConsultoriosStack';

export default function editarConsultorios() {
    const navigation = useNavigation();
    const route = useRoute();

    const { consultorios } = route.params?.consultorio;

    const [BloqueConsultorio, setBloqueConsultorios] = useState(consultorio ? consultori.BloqueConsultorio : '');
    const [NumeroConsultorio, setNumeroConsultorio] = useState(consultorio ? String(consultorio.NumeroConsultorio) : '');
    const [idMedico, setIdMedico] = useState(consultorio ? consultorio.idMedico : '');
    const [loading, setLoading] = useState(false);

    const esEdicion = !!paciente;

    const handleGuardar = async ()=>{
        if (!BloqueConsultorio || !NumeroConsultorio || !idMedico) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }
        setLoading(true);
        try {
            let result;
            if (esEdicion) {
                result = await editarPaciente(paciente.id,
                     { BloqueConsultorio, 
                        NumeroConsultorio,
                         idMedico, 
                        });
            }else {
                result = await crearConsultorios({ BloqueConsultorio, NumeroConsultorio, idMedico,  });
            }
            if (result.succes) {
                Alert.alert('Éxito', `consultorio ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
                navigation.goBack(); // Volver a la pantalla anterior
            } else {
                Alert.alert('Error', result.message || 'Hubo un problema al guardar el consultorio.');
            }

    }catch (error) {
        Alert.alert('Error', 'Hubo un problema al guardar el consultorio.');
    } finally {
        setLoading(false);
    }
}

return(
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
             <Text style={styles.title}>{esEdicion ? 'Editar consultorio' : 'Crear consultorio'}</Text>
             <TextInput
                 style={styles.input}
                 placeholder="BloqueConsultorio"
                    value={nombre}
                    onChangeText={setBloqueConsultorios}
                    />
                <TextInput 
                    style={styles.input}
                    placeholder="NumeroConsultorio"
                    value={apellido}
                    onChangeText={setNumeroConsultorio}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="idMedico"
                    value={documento}
                    onChangeText={setIdMedico}
                    keyboardType="numeric"
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
