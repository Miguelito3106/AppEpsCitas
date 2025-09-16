import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Citas({ navigation }) {
  const citas = [
    { id: "1", paciente: "Juan Pérez", fecha: "2025-09-20", hora: "10:00 AM", doctor: "Dr. Ramírez" },
    { id: "2", paciente: "María Gómez", fecha: "2025-09-21", hora: "02:30 PM", doctor: "Dra. Sánchez" },
    { id: "3", paciente: "Carlos López", fecha: "2025-09-22", hora: "09:00 AM", doctor: "Dr. Fernández" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalleCita", { cita: item })}
    >
      <MaterialIcons name="event" size={28} color="#2563eb" style={{ marginRight: 10 }} />
      <View>
        <Text style={styles.nombre}>{item.paciente}</Text>
        <Text style={styles.info}>{item.fecha} - {item.hora}</Text>
        <Text style={styles.info}>Doctor: {item.doctor}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Citas Programadas</Text>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e293b",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  info: {
    fontSize: 14,
    color: "#6b7280",
  },
});
