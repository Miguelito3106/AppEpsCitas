// Screen/login/registrar.js - VERSIÓN SIMPLIFICADA TEMPORAL
import { useState } from "react";
import { 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  View,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { registerUser } from "../../Src/Services/AuthService";

export default function Register({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("paciente");
  const [especialidad, setEspecialidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Opciones de roles
  const roles = [
    { value: "paciente", label: "👤 Paciente" },
    { value: "medico", label: "🩺 Médico" },
    { value: "admin", label: "⚙️ Administrador" }
  ];

  // Especialidades médicas
  const especialidades = [
    "Medicina General",
    "Cardiología",
    "Dermatología",
    "Pediatría",
    "Ginecología",
    "Ortopedia",
    "Neurología",
    "Psiquiatría",
    "Oftalmología",
    "Otorrinolaringología"
  ];

  const [showEspecialidadModal, setShowEspecialidadModal] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Validaciones básicas
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Error", "Por favor, completa todos los campos obligatorios");
        return;
      }

      if (role === 'medico' && !especialidad) {
        Alert.alert("Error", "Por favor, selecciona una especialidad para el médico");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Error", "Por favor, ingresa un email válido");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
        return;
      }

      console.log("Enviando registro...");
      
      // VERSIÓN TEMPORAL: Solo enviar datos básicos
      const result = await registerUser(
        name, 
        email, 
        password, 
        role, 
        role === 'medico' ? especialidad : null
        // TEMPORAL: No enviar teléfono y fecha de nacimiento
      );

      if (result.success) {
        Alert.alert("Éxito", "Usuario registrado correctamente", [
          {
            text: "OK",
            onPress: () => {
              // Redirigir al login
              navigation.navigate("Login");
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error de registro",
          result.message || "Ocurrió un error al registrar el usuario"
        );
      }
    } catch (error) {
      console.error("Error inesperado en registro:", error);
      Alert.alert("Error", "Ocurrió un error inesperado al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (roleValue) => {
    const roleObj = roles.find(r => r.value === roleValue);
    return roleObj ? roleObj.label : "Selecciona un rol";
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f0f0" }} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo *"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico *"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* TEMPORAL: Quitar teléfono y fecha de nacimiento hasta arreglar backend */}
      
      {/* Selector de Rol */}
      <Text style={styles.label}>Rol *</Text>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setShowRoleModal(true)}
      >
        <Text style={styles.selectorText}>
          {getRoleLabel(role)}
        </Text>
        <Text style={styles.selectorArrow}>▼</Text>
      </TouchableOpacity>

      {/* Selector de Especialidad (solo para médicos) */}
      {role === 'medico' && (
        <>
          <Text style={styles.label}>Especialidad *</Text>
          <TouchableOpacity 
            style={styles.selector}
            onPress={() => setShowEspecialidadModal(true)}
          >
            <Text style={styles.selectorText}>
              {especialidad || "Selecciona una especialidad"}
            </Text>
            <Text style={styles.selectorArrow}>▼</Text>
          </TouchableOpacity>
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Contraseña *"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña *"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.loginText}>
        ¿Ya tienes cuenta?{" "}
        <Text style={{ color: "#007BFF" }} onPress={() => navigation.navigate("Login")}>
          Inicia sesión
        </Text>
      </Text>

      {/* Modal para seleccionar Rol */}
      <Modal
        visible={showRoleModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowRoleModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona un Rol</Text>
                {roles.map((roleOption) => (
                  <TouchableOpacity
                    key={roleOption.value}
                    style={[
                      styles.modalOption,
                      role === roleOption.value && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setRole(roleOption.value);
                      setShowRoleModal(false);
                      // Si no es médico, limpiar especialidad
                      if (roleOption.value !== 'medico') {
                        setEspecialidad("");
                      }
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      role === roleOption.value && styles.modalOptionTextSelected
                    ]}>
                      {roleOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowRoleModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para seleccionar Especialidad */}
      <Modal
        visible={showEspecialidadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEspecialidadModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEspecialidadModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona Especialidad</Text>
                <ScrollView style={styles.modalScroll}>
                  {especialidades.map((esp) => (
                    <TouchableOpacity
                      key={esp}
                      style={[
                        styles.modalOption,
                        especialidad === esp && styles.modalOptionSelected
                      ]}
                      onPress={() => {
                        setEspecialidad(esp);
                        setShowEspecialidadModal(false);
                      }}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        especialidad === esp && styles.modalOptionTextSelected
                      ]}>
                        {esp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowEspecialidadModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

// Los estilos se mantienen igual...
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
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    width: "100%",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "left",
  },
  selector: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  selectorArrow: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionSelected: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalOptionTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  modalCancel: {
    marginTop: 15,
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
});