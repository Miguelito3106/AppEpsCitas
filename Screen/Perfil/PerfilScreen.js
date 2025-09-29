import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Services/conexion";

export default function PerfilScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                console.log("Token obtenido:", token ? "Sí" : "No");
                
                if (!token) {
                    Alert.alert("Error", "No se encontró el token de usuario");
                    navigation.navigate("Login"); // Redirige al login
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
                
            } catch (error) {
                console.error("Error completo al cargar perfil:", error);
                
                // Verifica si el interceptor ya manejó el error
                if (error.isAuthError || error.shouldRedirectToLogin) {
                    console.log("Redirigiendo al login por error de autenticación");
                    navigation.navigate("Login");
                    return;
                }

                // Manejo específico de errores
                if (error.response) {
                    console.log("Error response data:", error.response.data);
                    console.log("Error response status:", error.response.status);
                    
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
                    } else if (error.response.status === 500) {
                        Alert.alert(
                            "Error del servidor",
                            "El servidor tiene problemas internos. Intenta más tarde.",
                            [
                                {
                                    text: "OK",
                                    onPress: async () => {
                                        // No eliminar el token inmediatamente, podría ser un error temporal
                                    }
                                }
                            ]
                        );
                    }
                } else if (error.request) {
                    Alert.alert(
                        "Error de conexión",
                        "No se pudo conectar al servidor. Verifica tu conexión a internet",
                        [{ text: "OK" }]
                    );
                } else {
                    Alert.alert(
                        "Error inesperado",
                        "Ocurrió un error inesperado",
                        [{ text: "OK" }]
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        
        cargarPerfil();
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Perfil de usuario</Text>
                <View style={styles.containerPerfil}>
                    <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de usuario</Text>
            <View style={styles.containerPerfil}>
                <Text style={styles.label}>Nombre: {usuario?.user?.name || "No disponible"}</Text>
                <Text style={styles.label}>Correo: {usuario?.user?.email || "No disponible"}</Text>
                <Text style={styles.label}>ID: {usuario?.user?.id || "No disponible"}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    containerPerfil: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    loadingText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    }
});