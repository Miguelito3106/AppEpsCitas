import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Alert, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator,
    RefreshControl,
    Modal,
    TextInput,
    Switch
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Services/conexion";

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [stats, setStats] = useState({
        citasTotales: 0,
        citasHoy: 0,
        pacientesAtendidos: 0,
        rating: 4.8
    });
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: ''
    });
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const cargarPerfil = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            console.log("Token obtenido:", token ? "Sí" : "No");
            
            if (!token) {
                Alert.alert("Error", "No se encontró el token de usuario");
                navigation.navigate("Login");
                return;
            }

            const response = await apiConexion.get("/me", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            console.log("Respuesta del servidor:", response.data);
            setUsuario(response.data);
            
            // Simular datos de estadísticas
            setStats({
                citasTotales: 156,
                citasHoy: 8,
                pacientesAtendidos: 124,
                rating: 4.8
            });
            
        } catch (error) {
            console.error("Error completo al cargar perfil:", error);
            manejarErrorPerfil(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const manejarErrorPerfil = (error) => {
        if (error.isAuthError || error.shouldRedirectToLogin) {
            navigation.navigate("Login");
            return;
        }

        if (error.response) {
            if (error.response.status === 401) {
                Alert.alert(
                    "Sesión expirada",
                    "Tu sesión ha expirado, por favor inicia sesión nuevamente",
                    [
                        {
                            text: "OK",
                            onPress: async () => {
                                await AsyncStorage.removeItem("userToken");
                                navigation.navigate("Login");
                            }
                        }
                    ]
                );
            }
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        cargarPerfil();
    };

    useEffect(() => {
        cargarPerfil();
    }, [navigation]);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Cerrar Sesión", 
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem("userToken");
                        navigation.navigate("Login");
                    }
                }
            ]
        );
    };

    const handleEditProfile = () => {
        setEditData({
            name: usuario?.user?.name || '',
            email: usuario?.user?.email || '',
            phone: usuario?.user?.phone || '+1 234 567 8900',
            specialty: usuario?.user?.specialty || 'Medicina General'
        });
        setEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        // Aquí iría la lógica para guardar los cambios en el servidor
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        setEditModalVisible(false);
        // Recargar perfil
        cargarPerfil();
    };

    const StatCard = ({ icon, value, label, color }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
                {icon}
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const ActionButton = ({ icon, title, subtitle, onPress, color }) => (
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <View style={[styles.actionIcon, { backgroundColor: color }]}>
                {icon}
            </View>
            <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Perfil de usuario</Text>
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
                    <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={cargarPerfil}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#007AFF"]}
                />
            }
        >
            {/* Header del Perfil */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Feather name="camera" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>{usuario?.user?.name || "Usuario"}</Text>
                <Text style={styles.userEmail}>{usuario?.user?.email || "usuario@ejemplo.com"}</Text>
                <Text style={styles.userRole}>Médico Especialista</Text>
                
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{stats.rating}</Text>
                    <Text style={styles.ratingCount}>(124 evaluaciones)</Text>
                </View>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estadísticas</Text>
                <View style={styles.statsGrid}>
                    <StatCard 
                        icon={<Feather name="calendar" size={20} color="#007AFF" />}
                        value={stats.citasTotales}
                        label="Citas Totales"
                        color="#007AFF"
                    />
                    <StatCard 
                        icon={<Feather name="clock" size={20} color="#34C759" />}
                        value={stats.citasHoy}
                        label="Citas Hoy"
                        color="#34C759"
                    />
                    <StatCard 
                        icon={<Feather name="users" size={20} color="#FF9500" />}
                        value={stats.pacientesAtendidos}
                        label="Pacientes"
                        color="#FF9500"
                    />
                    <StatCard 
                        icon={<Feather name="award" size={20} color="#FF2D55" />}
                        value={`${stats.rating}/5`}
                        label="Calificación"
                        color="#FF2D55"
                    />
                </View>
            </View>

            {/* Acciones Rápidas */}
            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.quickAction}>
                        <View style={[styles.quickActionIcon, { backgroundColor: '#007AFF20' }]}>
                            <Feather name="calendar" size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.quickActionText}>Mi Agenda</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.quickAction}>
                        <View style={[styles.quickActionIcon, { backgroundColor: '#34C75920' }]}>
                            <Feather name="file-text" size={24} color="#34C759" />
                        </View>
                        <Text style={styles.quickActionText}>Historial</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.quickAction}>
                        <View style={[styles.quickActionIcon, { backgroundColor: '#FF950020' }]}>
                            <Feather name="message-circle" size={24} color="#FF9500" />
                        </View>
                        <Text style={styles.quickActionText}>Mensajes</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.quickAction}>
                        <View style={[styles.quickActionIcon, { backgroundColor: '#FF2D5520' }]}>
                            <Feather name="bar-chart" size={24} color="#FF2D55" />
                        </View>
                        <Text style={styles.quickActionText}>Reportes</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Opciones del Perfil */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Configuración</Text>
                
                <ActionButton 
                    icon={<Feather name="edit-3" size={20} color="#FFF" />}
                    title="Editar Perfil"
                    subtitle="Actualiza tu información personal"
                    onPress={handleEditProfile}
                    color="#007AFF"
                />
                
                <ActionButton 
                    icon={<Feather name="bell" size={20} color="#FFF" />}
                    title="Notificaciones"
                    subtitle="Gestiona tus preferencias"
                    onPress={() => setNotifications(!notifications)}
                    color="#FF9500"
                />
                
                <ActionButton 
                    icon={<Feather name="shield" size={20} color="#FFF" />}
                    title="Privacidad y Seguridad"
                    subtitle="Controla tu privacidad"
                    onPress={() => setModalVisible(true)}
                    color="#34C759"
                />
                
                <ActionButton 
                    icon={<Feather name="moon" size={20} color="#FFF" />}
                    title="Modo Oscuro"
                    subtitle="Cambiar tema de la aplicación"
                    onPress={() => setDarkMode(!darkMode)}
                    color="#5856D6"
                />
                
                <ActionButton 
                    icon={<Feather name="help-circle" size={20} color="#FFF" />}
                    title="Ayuda y Soporte"
                    subtitle="Centro de ayuda y contacto"
                    onPress={() => navigation.navigate('Help')}
                    color="#FF2D55"
                />
            </View>

            {/* Botón de Cerrar Sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#FF3B30" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            {/* Modal de Edición de Perfil */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Perfil</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.inputLabel}>Nombre Completo</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editData.name}
                                onChangeText={(text) => setEditData({...editData, name: text})}
                                placeholder="Ingresa tu nombre"
                            />
                            
                            <Text style={styles.inputLabel}>Correo Electrónico</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editData.email}
                                onChangeText={(text) => setEditData({...editData, email: text})}
                                placeholder="Ingresa tu correo"
                                keyboardType="email-address"
                            />
                            
                            <Text style={styles.inputLabel}>Teléfono</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editData.phone}
                                onChangeText={(text) => setEditData({...editData, phone: text})}
                                placeholder="Ingresa tu teléfono"
                                keyboardType="phone-pad"
                            />
                            
                            <Text style={styles.inputLabel}>Especialidad</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editData.specialty}
                                onChangeText={(text) => setEditData({...editData, specialty: text})}
                                placeholder="Ingresa tu especialidad"
                            />
                        </ScrollView>
                        
                        <View style={styles.modalFooter}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveProfile}
                            >
                                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF3B30',
        marginTop: 16,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    profileHeader: {
        backgroundColor: '#FFF',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1c1e',
        marginLeft: 4,
        marginRight: 4,
    },
    ratingCount: {
        fontSize: 14,
        color: '#666',
    },
    statsSection: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        width: '48%',
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    actionsSection: {
        padding: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAction: {
        alignItems: 'center',
        width: '23%',
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    settingsSection: {
        padding: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1c1e',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
        marginLeft: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    modalBody: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1c1c1e',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});