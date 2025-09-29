import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  Animated,
  Dimensions,
  StatusBar 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

export default function Inicio({ navigation }) {
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  
  const menuItems = [
    { title: 'Dashboard', icon: 'dashboard', route: 'Dashboard' },
    { title: 'Pacientes', icon: 'people', route: 'Pacientes' },
    { title: 'Médicos', icon: 'local-hospital', route: 'Medicos' },
    { title: 'Citas', icon: 'event', route: 'Citas' },
    { title: 'Consultorios', icon: 'business', route: 'Consultorios' },
    { title: 'Horarios Médicos', icon: 'schedule', route: 'HorariosMedicosStack' }
  ];

  const statsData = [
    { title: 'Total Pacientes', value: '3', icon: 'people', color: '#3B82F6' },
    { title: 'Total Médicos', value: '3', icon: 'local-hospital', color: '#10B981' },
    { title: 'Citas Hoy', value: '2', icon: 'event', color: '#8B5CF6' },
    { title: 'Citas Pendientes', value: '1', icon: 'schedule', color: '#F59E0B' },
    { title: 'Citas Completadas', value: '1', icon: 'check-circle', color: '#10B981' },
    { title: 'Citas Canceladas', value: '6', icon: 'check-#000', color: '#F59E0B' }
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleMenuPress = (item) => {
    if (item.route === 'Dashboard') {
      setSelectedMenu(item.title);
    } else {
      navigation.navigate(item.route);
    }
  };

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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Administrador</Text>
          <Text style={styles.sidebarSubtitle}>Gestión de citas médicas </Text>
          
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  selectedMenu === item.title && styles.selectedMenuItem
                ]}
                onPress={() => handleMenuPress(item)}
              >
                <MaterialIcons 
                  name={item.icon} 
                  size={20} 
                  color={selectedMenu === item.title ? '#ffffff' : '#64748b'} 
                />
                <Text style={[
                  styles.menuText,
                  selectedMenu === item.title && styles.selectedMenuText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
                <Text style={styles.dashboardSubtitle}>
                  Resumen general del sistema de gestión médica
                </Text>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                    <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                      <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
              ))}
            </View>

            {/* Sections */}
            <View style={styles.sectionsContainer}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Próximas Citas</Text>
                <View style={styles.appointmentCard}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>María González López</Text>
                    <Text style={styles.doctorInfo}>Dr. Juan Pérez García - Cardiología</Text>
                  </View>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.appointmentDate}>2025-01-15</Text>
                    <Text style={styles.appointmentHour}>09:00</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Médicos por Especialidad</Text>
                <View style={styles.specialtyCard}>
                  <Text style={styles.specialtyName}>Cardiología</Text>
                  <Text style={styles.specialtyCount}>1</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedMenuItem: {
    backgroundColor: '#1e293b',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  selectedMenuText: {
    color: '#ffffff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    padding: 32,
  },
  header: {
    marginBottom: 32,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: (width - 280 - 64 - 48) / 3, // Adjust for sidebar and gaps
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  section: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  doctorInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  appointmentHour: {
    fontSize: 14,
    color: '#64748b',
  },
  specialtyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  specialtyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  specialtyCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
});