import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity,Alert,ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearConsultorios, editarConsultorios } from '../../Src/Services/ConsultoriosService';

export default function EditarConsultoriosScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { consultorio } = route.params || {};

    const [BloqueConsultorio, setBloqueConsultorio] = useState(consultorio ? consultorio.BloqueConsultorio : '');
    const [NumeroConsultorio, setNumeroConsultorio] = useState(consultorio ? String(consultorio.NumeroConsultorio) : '');
    const [idMedico, setIdMedico] = useState(consultorio ? consultorio.idMedico : '');
    const [loading, setLoading] = useState(false);

    const esEdicion = !!consultorio;

    const handleGuardar = async ()=>{
        if (!BloqueConsultorio || !NumeroConsultorio || !idMedico) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }
        setLoading(true);
        try {
            let result;
            if (esEdicion) {
                result = await editarConsultorios(consultorio.id,
                     { 
                         BloqueConsultorio, 
                         NumeroConsultorio: parseInt(NumeroConsultorio),
                         idMedico, 
                     });
            } else {
                result = await crearConsultorios({ 
                    BloqueConsultorio, 
                    NumeroConsultorio: parseInt(NumeroConsultorio), 
                    idMedico 
                });
            }
            if (result.succes) {
                Alert.alert('Éxito', `Consultorio ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
                navigation.goBack();
            } else {
                Alert.alert('Error', result.message || 'Hubo un problema al guardar el consultorio.');
            }

        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al guardar el consultorio.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                 <Text style={styles.title}>{esEdicion ? 'Editar consultorio' : 'Crear consultorio'}</Text>
                 <TextInput
                     style={styles.input}
                     placeholder="Bloque Consultorio"
                        value={BloqueConsultorio}
                        onChangeText={setBloqueConsultorio}
                        />
                    <TextInput 
                        style={styles.input}
                        placeholder="Número Consultorio"
                        value={NumeroConsultorio}
                        onChangeText={setNumeroConsultorio}
                        keyboardType="numeric"
                        />
                    <TextInput
                        style={styles.input}
                        placeholder="ID Médico"
                        value={idMedico}
                        onChangeText={setIdMedico}
                        keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleGuardar} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.buttonText}>Guardar</Text>
                            )}
                        </TouchableOpacity>
             </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F6FF",
  },
  innerContainer: {
    padding: 20,
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
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});