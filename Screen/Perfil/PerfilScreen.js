import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConexion from "../../Src/Services/conexion";

export default function perfilScreen({ navigation }) {

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true); // ← agregado para evitar error

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) {
                    Alert.alert("No se encontró el token de usuario, redirigiendo al login");
                    return;
                }
                const response = await apiConexion.get("/me");
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al cargar el perfil", error);
                if (error.isAuthError || error.shouldRedirectToLogin) { // corregido showlRedirectToLogin
                    console.log("Error de autenticación manejado por el interceptor, redirigiendo al login");
                    return;
                }

                if (error.response) {
                    Alert.alert(
                        "Error del servidor",
                        `Error ${error.response.status}: ${error.response.data?.message || "Ocurrió un error al cargar el perfil"}`,
                        [
                            {
                                text: "Ok", // corregido Text -> text
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                }
                            }
                        ]
                    );
                } else if (error.request) {
                    Alert.alert(
                        "Error de conexión",
                        "No se pudo conectar al servidor. Verifica tu conexión a internet",
                        [
                            {
                                text: "Ok",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        "Error",
                        "Ocurrió un error inesperado al cargar el perfil",
                        [
                            {
                                text: "Ok",
                                onPress: async () => {
                                    await AsyncStorage.removeItem("userToken");
                                }
                            }
                        ]
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        cargarPerfil();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Cargando perfil...</Text>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Perfil de usuario</Text>
                <View style={styles.containerPerfil}>
                    <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Perfil de usuario</Text>
            <View style={styles.containerPerfil}>
                <Text style={styles.label}>Nombre: {usuario?.user?.name || "No disponible"}</Text>
                <Text style={styles.label}>Correo: {usuario?.user?.email || "No disponible"}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    containerPerfil: {
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    }
});
