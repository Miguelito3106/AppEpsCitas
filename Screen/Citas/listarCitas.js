import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native'
import { listarCitas, EliminarCita } from '../../Src/Services/CitasService'
import { useNavigation } from '@react-navigation/native'
import CitasCard from '../../Components/CitasCard'
import { useEffect, useState } from 'react'

export default function ListarCitas() {
  const [citas, setCitas] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const handleCitas = async () => {
    setLoading(true);
    try {
      const result = await listarCitas();
      if (result.succes) {
        setCitas(result.data);
      } else {
        Alert.alert("Error", result.message || "Error al cargar citas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', handleCitas);
    return unsubscribe;
  }, [navigation]);

  const handleEditar = (cita) => {
    navigation.navigate('EditarCitas', { cita });
  };

  const handleCrearCita = () => {
    navigation.navigate('CrearCita'); // ojo: que coincida con tu Stack
  };

  const handleEliminar = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await EliminarCita(id);
              if (result.succes) {
                setCitas(citas.filter(cita => cita.id !== id));
              } else {
                Alert.alert("Error", result.message || "Error al eliminar la cita");
              }
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar la cita");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={citas}  
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CitasCard
            cita={item}
            onEdit={() => handleEditar(item)}
            onDelete={() => handleEliminar(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay citas disponibles.</Text>}
        contentContainerStyle={citas.length === 0 && { flex: 1, justifyContent: "center" }}
      />
      <TouchableOpacity style={styles.botoncrear} onPress={handleCrearCita}>
        <Text style={styles.textoboton}>+ Crear Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
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
