import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Inicio({ navigation }) {
  const opciones = [
    { titulo: "Citas", ruta: "Citas", icono: "event" },
    { titulo: "Consultorios", ruta: "Consultorios", icono: "business" },
    { titulo: "Horarios Médicos", ruta: "HorariosMedicos", icono: "schedule" },
    { titulo: "Médicos", ruta: "Medicos", icono: "local-hospital" },
    { titulo: "Pacientes", ruta: "Pacientes", icono: "people" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Panel Principal</Text>

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
    marginBottom: 25,
    color: "#1e293b",
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  icono: {
    marginRight: 15,
  },
  cardTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
