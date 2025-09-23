import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Inicio({ navigation }) {
  const opciones = [
    { titulo: "Citas", ruta: "Citas", icono: "event" },
    { titulo: "Consultorios", ruta: "Consultorios", icono: "business" },
    { titulo: "Horarios Médicos", ruta: "HorariosMedicos", icono: "schedule" },
    { titulo: "Médicos", ruta: "Medicos", icono: "local-hospital" },
    { titulo: "Pacientes", ruta: "Pacientes", icono: "people" },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Panel Principal</Text>
        
        <Text style={styles.subtitulo}>
          Bienvenido al sistema de gestión médica
        </Text>

        {opciones.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(item.ruta)}
          >
            <MaterialIcons name={item.icono} size={28} color="#fff" style={styles.icono} />
            <Text style={styles.cardTexto}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginVertical: 12,
    width: "100%",
    // Usar elevation para Android y shadow props corregidas para iOS/web
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  icono: {
    marginRight: 15,
  },
  cardTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
    width: "100%",
    justifyContent: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});