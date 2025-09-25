import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { listarMedicos as listarMedicosService, eliminarMedico } from "../../Src/Services/MedicosService";
import { useNavigation } from "@react-navigation/native";
import MedicosCard from "../../Components/MedicosCard";

export default function ListarMedicos() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleMedicos = async () => {
    setLoading(true);
    try {
      const result = await listarMedicosService();
      if (result.succes) {
        setMedicos(result.data);
      } else {
        Alert.alert("Error", result.message || "Error al cargar Médicos");
      }
    } catch (error) {
      Alert.alert("Error", "No se pueden cargar los médicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", handleMedicos);
    return unsubscribe;
  }, [navigation]);

  const handleEditar = (medico) => {
    navigation.navigate("EditarMedicos", { medico });
  };

  const handleCrearMedicos = () => {
    navigation.navigate("AgregarMedico");
  };

  const handleEliminar = (id) => {
    Alert.alert("Confirmar Eliminación", "¿Estás seguro de eliminar este médico?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await eliminarMedico(id);
            if (result.succes) {
              handleMedicos();
            } else {
              Alert.alert("Error", result.message || "Error al eliminar médico");
            }
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el médico");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.centered} />
      ) : (
        <FlatList
          data={medicos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MedicosCard
              medico={item}
              onEdit={() => handleEditar(item)}
              onDelete={() => handleEliminar(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No hay Médicos registrados.</Text>}
        />
      )}
      <TouchableOpacity style={styles.botoncrear} onPress={handleCrearMedicos}>
        <Text style={styles.textoboton}>Crear Médico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  botoncrear: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  textoboton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
