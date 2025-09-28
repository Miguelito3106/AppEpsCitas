import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearHorariosMedicos, actualizarHorariosMedicos } from '../../Src/Services/MedicosServiceService';

export default function EditarHorariosMedicos() {
    const navigation = useNavigation();
    const route = useRoute();
    const horarioEditar = route.params?.horario;

    const [dia, setDia] = useState(horarioEditar?.dia || '');
    const [horaInicio, setHoraInicio] = useState(horarioEditar?.hora_inicio || '');
    const [horaFin, setHoraFin] = useState(horarioEditar?.hora_fin || '');
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        if (!dia || !horaInicio || !horaFin) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
        setLoading(true);
        try {
            let result;
            if (horarioEditar) {
                result = await actualizarHorariosMedicos(horarioEditar.id, { dia, hora_inicio: horaInicio, hora_fin: horaFin });
            } else {
                result = await crearHorariosMedicos({ dia, hora_inicio: horaInicio, hora_fin: horaFin });
            }
            if (result.succes) {
                Alert.alert('Éxito', horarioEditar ? 'Horario actualizado' : 'Horario creado', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', result.message || 'Ocurrió un error');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el horario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Día</Text>
            <TextInput
                style={styles.input}
                value={dia}
                onChangeText={setDia}
                placeholder="Ej: Lunes"
            />
            <Text style={styles.label}>Hora de Inicio</Text>
            <TextInput
                style={styles.input}
                value={horaInicio}
                onChangeText={setHoraInicio}
                placeholder="Ej: 08:00"
            />
            <Text style={styles.label}>Hora de Fin</Text>
            <TextInput
                style={styles.input}
                value={horaFin}
                onChangeText={setHoraFin}
                placeholder="Ej: 12:00"
            />
            <TouchableOpacity style={styles.boton} onPress={handleGuardar} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.textoBoton}>{horarioEditar ? 'Actualizar' : 'Crear'}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
    },
    boton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    textoBoton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});