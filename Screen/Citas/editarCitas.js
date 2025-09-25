import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { crearCita, editarCita } from "../../Src/Services/CitasService";

export default function EditarCitas() {
  const navigation = useNavigation();
  const route = useRoute();

  const cita = route.params?.cita; // aquí recibes la cita cuando vienes desde "editar"

  const [idPaciente, setIdPaciente] = useState(cita ? String(cita.idPaciente) : "");
  const [idMedico, setIdMedico] = useState(cita ? String(cita.idMedico) : "");
  const [fecha_cita, setFecha_cita] = useState(cita ? cita.fecha_cita : "");
  const [hora_cita, setHora_cita] = useState(cita ? cita.hora_cita : "");
  const [estado, setEstado] = useState(cita ? cita.estado : "");
  const [motivo, setMotivo] = useState(cita ? cita.motivo : "");
  const [loading, setLoading] = useState(false);

  const esEdicion = !!cita;

  const handleGuardar = async () => {
    if (!idPaciente || !idMedico || !fecha_cita || !hora_cita || !estado || !motivo) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (esEdicion) {
        result = await editarCita(cita.id, {
          idPaciente,
          idMedico,
          fecha_cita,
          hora_cita,
          estado,
          motivo,
        });
      } else {
        result = await crearCita({
          idPaciente,
          idMedico,
          fecha_cita,
          hora_cita,
          estado,
          motivo,
        });
      }

      if (result.success) { // corregido
        Alert.alert("Éxito", `Cita ${esEdicion ? "editada" : "creada"} exitosamente.`);
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Hubo un problema al guardar la cita.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Hubo un problema al guardar la cita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{esEdicion ? "Editar Cita" : "Crear Cita"}</Text>

        <TextInput
          style={styles.input}
          placeholder="ID Paciente"
          value={idPaciente}
          onChangeText={setIdPaciente}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="ID Médico"
          value={idMedico}
          onChangeText={setIdMedico}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de la Cita (YYYY-MM-DD)"
          value={fecha_cita}
          onChangeText={setFecha_cita}
        />
        <TextInput
          style={styles.input}
          placeholder="Hora de la Cita (HH:MM)"
          value={hora_cita}
          onChangeText={setHora_cita}
        />
        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
        />
        <TextInput
          style={styles.input}
          placeholder="Motivo"
          value={motivo}
          onChangeText={setMotivo}
        />

        <TouchableOpacity style={styles.boton} onPress={handleGuardar} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>
              {esEdicion ? "Guardar Cambios" : "Crear Cita"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F6FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E3A8A",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  boton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
