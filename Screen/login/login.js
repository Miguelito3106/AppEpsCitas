import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  View
} from "react-native";
import { loginUser } from "../../Src/Services/AuthService";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return;
    }

    try {
      setLoading(true);
      console.log("🔐 Intentando login...");
      
      // Usar el servicio de autenticación real
      const result = await loginUser(email, password);
      console.log("📋 Resultado del login:", result);

      if (result.success) {
        console.log("✅ Login exitoso, redirigiendo...");
        
        // NO mostrar alerta, redirigir inmediatamente
        // Forzar recarga del estado de autenticación
        setTimeout(() => {
          // La redirección se manejará automáticamente por AppNavegacion
          // debido al cambio de estado de userToken
          console.log("🔄 Recargando estado de autenticación...");
        }, 500);
        
      } else {
        Alert.alert("Error de login", result.message || "Credenciales incorrectas");
      }
      
    } catch (error) {
      console.error("❌ Error inesperado en login:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar token manualmente (debug)
  const clearToken = async () => {
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.removeItem("userToken");
      Alert.alert("Debug", "Token limpiado manualmente");
    } catch (error) {
      console.error("Error al limpiar token:", error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f0f0f0" }}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Register")}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>

      {/* Botón de debug para limpiar token */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={clearToken}
      >
        <Text style={styles.debugText}>[Debug] Limpiar Token</Text>
      </TouchableOpacity>

      {/* Información de debug */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugInfoText}>
          Estado: {loading ? "Cargando..." : "Listo"}
        </Text>
        <Text style={styles.debugInfoText}>
          Email: {email || "No ingresado"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  debugButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff6b6b",
    borderRadius: 5,
  },
  debugText: {
    color: "#fff",
    fontSize: 12,
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    width: "100%",
  },
  debugInfoText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});