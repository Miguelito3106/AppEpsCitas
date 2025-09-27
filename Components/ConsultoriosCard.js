import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function ConsultoriosCard({consultorio, onEdit, onDelete}) {
    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{consultorio.nombre || 'Consultorio Sin Nombre'}</Text>
                <Text style={styles.detail}>Bloque: {consultorio.BloqueConsultorio || 'No especificado'}</Text>
                <Text style={styles.detail}>Número: {consultorio.NumeroConsultorio || 'No especificado'}</Text>
                <Text style={styles.detail}>ID Médico: {consultorio.idMedico || 'No asignado'}</Text>
            </View>    
            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <Ionicons name="pencil" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>    
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    detail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 12,
        padding: 8,
    },
});