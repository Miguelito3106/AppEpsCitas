import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { crearHorariosMedicos, editarHorariosMedicos } from '../../Src/Services/HorariosMedicosService';

export default function EditarHorariosMedicosScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const horarioEditar = route.params?.horario;

    const [medicoId, setMedicoId] = useState(horarioEditar?.medico_id?.toString() || '');
    const [diaSemana, setDiaSemana] = useState(horarioEditar?.dia_semana || '');
    const [horaInicio, setHoraInicio] = useState(horarioEditar?.hora_inicio || '');
    const [horaFin, setHoraFin] = useState(horarioEditar?.hora_fin || '');
    const [loading, setLoading] = useState(false);

    const handleGuardar = async () => {
        if (!medicoId.trim() || !diaSemana.trim() || !horaInicio.trim() || !horaFin.trim()) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (horaFin <= horaInicio) {
            Alert.alert('Error', 'La hora de fin debe ser posterior a la hora de inicio');
            return;
        }

        setLoading(true);
        try {
            const data = {
                medico_id: parseInt(medicoId),
                dia_semana: diaSemana,
                hora_inicio: horaInicio,
                hora_fin: horaFin,
            };

            let result;
            if (horarioEditar) {
                result = await editarHorariosMedicos(horarioEditar.id, data);
            } else {
                result = await crearHorariosMedicos(data);
            }

            if (result?.success) {
                Alert.alert('Éxito', horarioEditar ? 'Horario actualizado' : 'Horario creado', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', result?.message || 'Ocurrió un error al guardar el horario');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar el horario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>ID Médico</Text>
            <TextInput
                style={styles.input}
                value={medicoId}
                onChangeText={setMedicoId}
                placeholder="Ej: 1"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Día de la Semana</Text>
            <TextInput
                style={styles.input}
                value={diaSemana}
                onChangeText={setDiaSemana}
                placeholder="Ej: Lunes, Martes, etc."
            />

            <Text style={styles.label}>Hora de Inicio</Text>
            <TextInput
                style={styles.input}
                value={horaInicio}
                onChangeText={setHoraInicio}
                placeholder="HH:MM (24h)"
            />

            <Text style={styles.label}>Hora de Fin</Text>
            <TextInput
                style={styles.input}
                value={horaFin}
                onChangeText={setHoraFin}
                placeholder="HH:MM (24h)"
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
