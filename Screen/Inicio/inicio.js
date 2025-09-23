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
        { text: "Cancelar", style: "cancel" },
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
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f9ff" }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Panel Principal</Text>
        <Text style={styles.subtitulo}>Bienvenido al sistema de gestión médica</Text>

        {opciones.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.ruta)}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons name={item.icono} size={28} color="#0ea5e9" />
            </View>
            <Text style={styles.cardTexto}>{item.titulo}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 25,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconWrapper: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
  },
  cardTexto: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "linear-gradient(90deg, #0ea5e9, #2563eb)", // gradiente
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 40,
    width: "100%",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 10,
  },
});
