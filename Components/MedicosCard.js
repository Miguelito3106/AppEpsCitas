import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicosCardCard({ medico, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{medico.nombre} {medico.apellido}</Text>
        <Text style={styles.detail}>Documento: {medico.documento}</Text>
        <Text style={styles.detail}>Email: {medico.email}</Text>
        <Text style={styles.detail}>Teléfono: {medico.telefono}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit(medico)} style={styles.actionButton}>
          <Ionicons name="pencil" size={20} color="#4caf50" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(medico)} style={styles.actionButton}>
          <Ionicons name="trash" size={20} color="#f44336" />
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#555',
  },
});
