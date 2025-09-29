import { useState, useEffect } from "react";
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
import authService from "../../Src/Services/AuthService";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Verificar si ya hay un usuario logueado al cargar
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        console.log("Usuario existente encontrado, redirigiendo...");
        redirectByRole(user.role);
      }
    } catch (error) {
      console.log("No hay usuario en sesión");
    }
  };

  // FUNCIÓN CORREGIDA - Usar navigate en lugar de reset
  const redirectByRole = (userRole) => {
    console.log("Redirigiendo por rol:", userRole);

    try {
      // Todos los roles van a MainTabs que maneja la redirección automática
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Error en redirección:', error);
      // Fallback seguro
      navigation.navigate('MainTabs');
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Validaciones básicas
      if (!email || !password) {
        Alert.alert("Error", "Por favor, ingresa email y contraseña");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Por favor, ingresa un email válido");
        return;
      }

      console.log("Intentando login...");
      
      const result = await authService.login(email, password);
      
      if (result.user) {
        console.log("Login exitoso, usuario:", result.user);
        
        // Redirigir directamente sin mostrar alerta
        redirectByRole(result.user.role);
      } else {
        Alert.alert("Error", "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error completo en login:", error);
      Alert.alert(
        "Error de login",
        error.message || "Credenciales inválidas o error de conexión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: "#f0f0f0" }} 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
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
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.registerText}>
        ¿No tienes cuenta?{" "}
        <Text 
          style={styles.registerLink} 
          onPress={() => !loading && navigation.navigate("Register")}
        >
          Regístrate
        </Text>
      </Text>
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
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#555",
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});