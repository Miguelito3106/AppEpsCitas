import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearConsultorios, editarConsultorios } from '../../Src/Services/ConsultoriosService';

export default function EditarConsultorios() {
    const navigation = useNavigation();
    const route = useRoute();

    const consultorio = route.params?.consultorio;

    const [BloqueConsultorio, setBloqueConsultorio] = useState(consultorio ? consultorio.BloqueConsultorio : '');
    const [NumeroConsultorio, setNumeroConsultorio] = useState(consultorio ? String(consultorio.NumeroConsultorio) : '');
    const [idMedico, setIdMedico] = useState(consultorio ? String(consultorio.idMedico) : '');
    const [loading, setLoading] = useState(false);

    const esEdicion = !!consultorio;

    const handleGuardar = async () => {
        // Validación de campos vacíos
        if (!BloqueConsultorio?.trim()) {
            Alert.alert('Error', 'Por favor, ingrese el bloque del consultorio.');
            return;
        }
        if (!NumeroConsultorio?.trim()) {
            Alert.alert('Error', 'Por favor, ingrese el número del consultorio.');
            return;
        }
        if (!idMedico?.trim()) {
            Alert.alert('Error', 'Por favor, ingrese el ID del médico.');
            return;
        }

        // Validación numérica solo para idMedico
        const idMedicoNumero = parseInt(idMedico);
        
        if (isNaN(idMedicoNumero) || idMedicoNumero <= 0) {
            Alert.alert('Error', 'El ID del médico debe ser un número válido mayor a 0.');
            return;
        }
        
        setLoading(true);
        try {
            // Preparar datos - IMPORTANTE: NumeroConsultorio como STRING
            const datosAEnviar = {
                BloqueConsultorio: BloqueConsultorio.trim(),
                NumeroConsultorio: NumeroConsultorio.trim(), // MANTENER como string
                idMedico: idMedicoNumero
            };

            console.log('🔍 Datos a enviar:', datosAEnviar);

            let result;
            if (esEdicion) {
                result = await editarConsultorios(consultorio.id, datosAEnviar);
            } else {
                result = await crearConsultorios(datosAEnviar);
            }
            
            console.log('📨 Resultado del servicio:', result);
            
            if (result.success) {
                Alert.alert('Éxito', `Consultorio ${esEdicion ? 'editado' : 'creado'} exitosamente.`);
                navigation.goBack();
            } else {
                // Mostrar el mensaje de error de forma legible
                try {
                    const errorData = JSON.parse(result.message);
                    let mensajeError = 'Errores:\n';
                    Object.keys(errorData).forEach(key => {
                        mensajeError += `• ${errorData[key].join(', ')}\n`;
                    });
                    Alert.alert('Error de Validación', mensajeError);
                } catch {
                    Alert.alert('Error', result.message || 'Hubo un problema al guardar el consultorio.');
                }
            }

        } catch (error) {
            console.error('💥 Error en handleGuardar:', error);
            Alert.alert('Error', 'Hubo un problema inesperado al guardar el consultorio.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>
                    {esEdicion ? 'Editar consultorio' : 'Crear consultorio'}
                </Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Bloque Consultorio (ej: A1)"
                    value={BloqueConsultorio}
                    onChangeText={setBloqueConsultorio}
                />
                
                <TextInput 
                    style={styles.input}
                    placeholder="Número Consultorio (ej: 101)"
                    value={NumeroConsultorio}
                    onChangeText={setNumeroConsultorio}
                    keyboardType="numeric" // Puedes mantener numeric, pero se enviará como string
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="ID Médico (número)"
                    value={idMedico}
                    onChangeText={setIdMedico}
                    keyboardType="numeric"
                />
                
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]} 
                    onPress={handleGuardar} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Guardar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
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
    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});