import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MedicosDashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [citasHoy, setCitasHoy] = useState([]);

  useEffect(() => {
    loadUserData();
    loadCitasDelDia();
  }, []);

  const loadUserData = async () => {
    try {
      setUser({ name: 'Carlos Rodríguez', especialidad: 'Cardiología' });
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const loadCitasDelDia = () => {
    setCitasHoy([
      { id: 1, paciente: 'Juan Pérez', hora: '09:00 AM', estado: 'confirmada' },
      { id: 2, paciente: 'María García', hora: '10:30 AM', estado: 'pendiente' },
    ]);
  };

  // SOLO UNA FUNCIÓN handleLogout - ELIMINA LAS OTRAS
  const handleLogout = () => {
    console.log("🟢 Botón cerrar sesión presionado");
    
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        {
          text: "Sí, Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("✅ Usuario confirmó cierre de sesión");
              
              // Limpiar storage
              await AsyncStorage.clear();
              console.log("🟢 AsyncStorage limpiado");
              
              // Navegar al Login
              console.log("🟢 Navegando a Login...");
              
              // Usar replace que es más confiable
              navigation.replace('Login');
              
            } catch (error) {
              console.error("🔴 Error en cierre de sesión:", error);
              // Forzar navegación incluso con error
              navigation.navigate('Login');
            }
          }
        }
      ]
    );
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>
              Bienvenido, Dr. {user.name}
            </Text>
            <Text style={styles.especialidadText}>
              {user.especialidad}
            </Text>
          </View>
          
          {/* BOTÓN CON LA ÚNICA FUNCIÓN handleLogout */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resto del contenido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Citas de Hoy</Text>
        {citasHoy.map((cita) => (
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
              <Text style={styles.estadoText}>{cita.estado}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Mi Agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Mis Pacientes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Mi Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Disponibilidad</Text>
          </TouchableOpacity>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
});