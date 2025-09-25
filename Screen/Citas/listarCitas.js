import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { listarCitas, EliminarCita } from '../../Src/Services/CitasService';
import { useNavigation } from '@react-navigation/native';
import CitasCard from '../../Components/CitasCard';
import { useEffect, useState } from 'react';

export default function ListarCitas() {
  const [citas, setCitas] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const handleCitas = async () => {
    setLoading(true);
    try {
      const result = await listarCitas();
      console.log("Respuesta API:", result);

      if (result.success && result.data?.data) {
        setCitas(result.data.data);  
      } else {
        Alert.alert("Error", result.message || "Error al cargar citas");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCitas();
    const unsubscribe = navigation.addListener('focus', handleCitas);
    return unsubscribe;
  }, [navigation]);

  const handleEditar = (cita) => {
    navigation.navigate('EditarCitas', { cita });
  };

  const handleCrearCita = () => {
    navigation.navigate('EditarCitas'); 
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
              if (result.success) {
                setCitas(citas.filter(cita => cita.id !== id));
              } else {
                Alert.alert("Error", result.message || "Error al eliminar la cita");
              }
            } catch (error) {
              console.error(error);
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
        keyExtractor={(item, index) => 
          (item.id ? item.id.toString() : index.toString())
        }
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

      {/* Botón flotante para crear cita */}
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
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4, // sombra en Android
    shadowColor: "#000", // sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  textoboton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
