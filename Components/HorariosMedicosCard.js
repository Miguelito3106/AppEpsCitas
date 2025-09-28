import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HorariosMedicosCard({ horario, onEdit, onDelete }) {
    return (
        <View style={styles.card}>
            <Text style={styles.dia}>{horario.dia}</Text>
            <Text>Inicio: {horario.hora_inicio}</Text>
            <Text>Fin: {horario.hora_fin}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.edit} onPress={onEdit}>
                    <Text style={styles.textBtn}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delete} onPress={onDelete}>
                    <Text style={styles.textBtn}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        elevation: 2,
    },
    dia: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-end',
    },
    edit: {
        marginRight: 15,
        backgroundColor: '#007bff',
        padding: 8,
        borderRadius: 5,
    },
    delete: {
        backgroundColor: '#dc3545',
        padding: 8,
        borderRadius: 5,
    },
    textBtn: {
        color: '#fff',
        fontWeight: 'bold',
    },
});