import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import authService from '../../Src/Services/AuthService';

export default function MedicoDashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);

  useEffect(() => {
    loadUserData();
    loadCitasDelDia();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const loadCitasDelDia = () => {
    // Simular datos de citas
    setCitasHoy([
      { id: 1, paciente: 'Juan Pérez', hora: '09:00 AM', estado: 'confirmada' },
      { id: 2, paciente: 'María García', hora: '10:30 AM', estado: 'pendiente' },
      { id: 3, paciente: 'Carlos López', hora: '02:00 PM', estado: 'confirmada' },
    ]);
  };

  const handleCitaPress = (cita) => {
    Alert.alert(
      `Cita con ${cita.paciente}`,
      `Hora: ${cita.hora}\nEstado: ${cita.estado}`,
      [{ text: 'OK' }]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenido, Dr. {user.name}
        </Text>
        <Text style={styles.especialidadText}>
          {user.especialidad || 'Especialidad'}
        </Text>
      </View>

      {/* Citas del día */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Citas de Hoy</Text>
        {citasHoy.length === 0 ? (
          <Text style={styles.emptyText}>No hay citas para hoy</Text>
        ) : (
          citasHoy.map((cita) => (
            <TouchableOpacity
              key={cita.id}
              style={styles.citaCard}
              onPress={() => handleCitaPress(cita)}
            >
              <View style={styles.citaInfo}>
                <Text style={styles.pacienteName}>{cita.paciente}</Text>
                <Text style={styles.citaHora}>{cita.hora}</Text>
              </View>
              <View style={[
                styles.estadoBadge,
                { backgroundColor: cita.estado === 'confirmada' ? '#28a745' : '#ffc107' }
              ]}>
                <Text style={styles.estadoText}>
                  {cita.estado}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AgendaMedico')}
          >
            <Text style={styles.actionText}>Mi Agenda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('PacientesMedico')}
          >
            <Text style={styles.actionText}>Mis Pacientes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('PerfilMedico')}
          >
            <Text style={styles.actionText}>Mi Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Disponibilidad')}
          >
            <Text style={styles.actionText}>Disponibilidad</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Citas Hoy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Esta Semana</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Este Mes</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  especialidadText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  citaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  citaInfo: {
    flex: 1,
  },
  pacienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  citaHora: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  estadoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
