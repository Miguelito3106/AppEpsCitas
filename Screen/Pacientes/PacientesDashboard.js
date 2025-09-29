import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert, // Añade Alert
} from 'react-native';
import authService from '../../Src/Services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Añade esta importación

export default function PacienteDashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [proximaCita, setProximaCita] = useState(null);
  const [citasRecientes, setCitasRecientes] = useState([]);

  useEffect(() => {
    loadUserData();
    loadCitas();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const loadCitas = () => {
    // Simular datos
    setProximaCita({
      id: 1,
      medico: 'Dr. Carlos Rodríguez',
      especialidad: 'Cardiología',
      fecha: '15 Oct 2024',
      hora: '10:00 AM',
      lugar: 'Consultorio 201',
    });

    setCitasRecientes([
      {
        id: 2,
        medico: 'Dra. Ana Martínez',
        especialidad: 'Dermatología',
        fecha: '01 Oct 2024',
        estado: 'completada',
      },
      {
        id: 3,
        medico: 'Dr. Luis García',
        especialidad: 'Medicina General',
        fecha: '20 Sep 2024',
        estado: 'completada',
      },
    ]);
  };

  // AÑADE ESTA FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          }
        }
      ]
    );
  };

  const handleAgendarCita = () => {
    navigation.navigate('AgendarCita');
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Hola, {user.name}</Text>
            <Text style={styles.subtitle}>Bienvenido a tu portal de paciente</Text>
          </View>
          {/* AÑADE EL BOTÓN DE CERRAR SESIÓN */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* El resto del código permanece igual */}
      {/* Próxima cita */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu Próxima Cita</Text>
        {proximaCita ? (
          <View style={styles.proximaCitaCard}>
            <View style={styles.citaHeader}>
              <Text style={styles.medicoName}>{proximaCita.medico}</Text>
              <Text style={styles.especialidad}>{proximaCita.especialidad}</Text>
            </View>
            <View style={styles.citaDetalles}>
              <Text style={styles.detalle}>📅 {proximaCita.fecha}</Text>
              <Text style={styles.detalle}>⏰ {proximaCita.hora}</Text>
              <Text style={styles.detalle}>📍 {proximaCita.lugar}</Text>
            </View>
            <View style={styles.citaActions}>
              <TouchableOpacity style={styles.btnSecundario}>
                <Text style={styles.btnSecundarioText}>Reagendar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimario}>
                <Text style={styles.btnPrimarioText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.sinCitaCard}>
            <Text style={styles.sinCitaText}>No tienes citas programadas</Text>
            <TouchableOpacity style={styles.btnAgendar} onPress={handleAgendarCita}>
              <Text style={styles.btnAgendarText}>Agendar Cita</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Acciones rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AgendarCita')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Agendar Cita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('HistorialCitas')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MedicosDisponibles')}
          >
            <Text style={styles.actionIcon}>👨‍⚕️</Text>
            <Text style={styles.actionText}>Médicos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PerfilPaciente')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Mi Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Citas recientes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Citas Recientes</Text>
        {citasRecientes.length === 0 ? (
          <Text style={styles.emptyText}>No hay citas recientes</Text>
        ) : (
          citasRecientes.map((cita) => (
            <View key={cita.id} style={styles.citaRecienteCard}>
              <View style={styles.citaRecienteInfo}>
                <Text style={styles.citaMedico}>{cita.medico}</Text>
                <Text style={styles.citaEspecialidad}>{cita.especialidad}</Text>
                <Text style={styles.citaFecha}>{cita.fecha}</Text>
              </View>
              <View
                style={[
                  styles.estadoBadge,
                  {
                    backgroundColor:
                      cita.estado === 'completada' ? '#28a745' : '#6c757d',
                  },
                ]}
              >
                <Text style={styles.estadoText}>{cita.estado}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Recordatorios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recordatorios</Text>
        <View style={styles.recordatorioCard}>
          <Text style={styles.recordatorioText}>
            💡 Recuerda llegar 15 minutos antes de tu cita
          </Text>
          <Text style={styles.recordatorioText}>
            📄 Trae tu documento de identidad
          </Text>
          <Text style={styles.recordatorioText}>
            🏥 Cancela con 24 horas de anticipación si no puedes asistir
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    backgroundColor: '#28a745', 
    padding: 20, 
    paddingTop: 40 
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 16, 
    color: 'white', 
    opacity: 0.9 
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // ... (el resto de los estilos permanecen igual)
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
    color: '#333' 
  },
  proximaCitaCard: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  citaHeader: { 
    marginBottom: 10 
  },
  medicoName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  especialidad: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2 
  },
  citaDetalles: { 
    marginBottom: 15 
  },
  detalle: { 
    fontSize: 14, 
    color: '#333', 
    marginBottom: 5 
  },
  citaActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  btnPrimario: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  btnPrimarioText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  btnSecundario: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  btnSecundarioText: { 
    color: 'white' 
  },
  sinCitaCard: { 
    alignItems: 'center', 
    padding: 20 
  },
  sinCitaText: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 15 
  },
  btnAgendar: {
    backgroundColor: '#007bff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 5,
  },
  btnAgendarText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  actionsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  actionIcon: { 
    fontSize: 24, 
    marginBottom: 5 
  },
  actionText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center' 
  },
  citaRecienteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  citaRecienteInfo: { 
    flex: 1 
  },
  citaMedico: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  citaEspecialidad: { 
    fontSize: 14, 
    color: '#666' 
  },
  citaFecha: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 2 
  },
  estadoBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15 
  },
  estadoText: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#666', 
    fontStyle: 'italic', 
    padding: 20 
  },
  recordatorioCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  recordatorioText: { 
    fontSize: 14, 
    color: '#856404', 
    marginBottom: 8 
  },
});