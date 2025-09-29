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
    { title: 'Citas Canceladas', value: '6', icon: 'cancel', color: '#EF4444' }
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
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Administrador</Text>
            <Text style={styles.sidebarSubtitle}>Gestión de citas médicas</Text>
          </View>
          
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
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
                <Text style={styles.dashboardSubtitle}>
                  Resumen general del sistema de gestión médica
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notificationButton}>
                  <MaterialIcons name="notifications" size={24} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <MaterialIcons name="account-circle" size={40} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <LinearGradient
                    colors={['#ffffff', '#f8fafc']}
                    style={styles.statGradient}
                  >
                    <View style={styles.statHeader}>
                      <Text style={styles.statTitle}>{stat.title}</Text>
                      <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                        <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                      </View>
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <View style={styles.statTrend}>
                      <MaterialIcons 
                        name="trending-up" 
                        size={16} 
                        color={index % 2 === 0 ? '#10B981' : '#EF4444'} 
                      />
                      <Text style={[
                        styles.trendText,
                        { color: index % 2 === 0 ? '#10B981' : '#EF4444' }
                      ]}>
                        {index % 2 === 0 ? '+12%' : '-5%'}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </View>

            {/* Sections */}
            <View style={styles.sectionsContainer}>
              {/* Próximas Citas Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Próximas Citas</Text>
                  <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>Ver todas</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.appointmentCard}>
                  <View style={styles.appointmentInfo}>
                    <View style={styles.patientAvatar}>
                      <MaterialIcons name="person" size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.appointmentDetails}>
                      <Text style={styles.patientName}>María González López</Text>
                      <Text style={styles.doctorInfo}>Dr. Juan Pérez García - Cardiología</Text>
                      <View style={styles.appointmentStatus}>
                        <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.statusText}>Confirmada</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.appointmentDate}>2025-01-15</Text>
                    <Text style={styles.appointmentHour}>09:00 AM</Text>
                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.appointmentCard}>
                  <View style={styles.appointmentInfo}>
                    <View style={styles.patientAvatar}>
                      <MaterialIcons name="person" size={24} color="#8B5CF6" />
                    </View>
                    <View style={styles.appointmentDetails}>
                      <Text style={styles.patientName}>Carlos Rodríguez</Text>
                      <Text style={styles.doctorInfo}>Dra. Ana Martínez - Dermatología</Text>
                      <View style={styles.appointmentStatus}>
                        <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.statusText}>Pendiente</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.appointmentDate}>2025-01-15</Text>
                    <Text style={styles.appointmentHour}>11:30 AM</Text>
                    <TouchableOpacity style={styles.viewButton}>
                      <Text style={styles.viewButtonText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Médicos por Especialidad Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Médicos por Especialidad</Text>
                  <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>Ver todos</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.specialtyCard}>
                  <View style={styles.specialtyInfo}>
                    <View style={[styles.specialtyIcon, { backgroundColor: '#3B82F6' }]}>
                      <MaterialIcons name="favorite" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.specialtyName}>Cardiología</Text>
                  </View>
                  <Text style={styles.specialtyCount}>1</Text>
                </View>

                <View style={styles.specialtyCard}>
                  <View style={styles.specialtyInfo}>
                    <View style={[styles.specialtyIcon, { backgroundColor: '#10B981' }]}>
                      <MaterialIcons name="skin" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.specialtyName}>Dermatología</Text>
                  </View>
                  <Text style={styles.specialtyCount}>1</Text>
                </View>

                <View style={styles.specialtyCard}>
                  <View style={styles.specialtyInfo}>
                    <View style={[styles.specialtyIcon, { backgroundColor: '#8B5CF6' }]}>
                      <MaterialIcons name="medical-services" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.specialtyName}>Medicina General</Text>
                  </View>
                  <Text style={styles.specialtyCount}>1</Text>
                </View>

                <View style={styles.specialtyCard}>
                  <View style={styles.specialtyInfo}>
                    <View style={[styles.specialtyIcon, { backgroundColor: '#F59E0B' }]}>
                      <MaterialIcons name="child-care" size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.specialtyName}>Pediatría</Text>
                  </View>
                  <Text style={styles.specialtyCount}>0</Text>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Actividad Reciente</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#10B98115' }]}>
                    <MaterialIcons name="add" size={16} color="#10B981" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Nuevo paciente registrado</Text>
                    <Text style={styles.activityTime}>Hace 2 minutos</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#3B82F615' }]}>
                    <MaterialIcons name="event-available" size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Cita completada</Text>
                    <Text style={styles.activityTime}>Hace 1 hora</Text>
                  </View>
                </View>
                
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: '#F59E0B15' }]}>
                    <MaterialIcons name="schedule" size={16} color="#F59E0B" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>Cita reagendada</Text>
                    <Text style={styles.activityTime}>Hace 3 horas</Text>
                  </View>
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
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    marginBottom: 32,
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
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  profileButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 24,
    paddingBottom: 16,
  },
  statCard: {
    width: (width - 280 - 64 - 32) / 3,
    minWidth: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    borderRadius: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
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
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionsContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 24,
    paddingTop: 0,
  },
  section: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  doctorInfo: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  appointmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  appointmentTime: {
    alignItems: 'flex-end',
    gap: 4,
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  appointmentHour: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  specialtyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  specialtyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  specialtyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  activitySection: {
    backgroundColor: '#ffffff',
    margin: 24,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
});