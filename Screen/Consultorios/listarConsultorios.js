import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { listarConsultorios, EliminarConsultorio } from '../../Src/Services/ConsultoriosStack';
import { useNavigation } from '@react-navigation/native';
import PacientesCard from '../../Components/ConsultoriosCard';
import { useEffect, useState } from 'react';

export default function ListarConsultorios() {
    const [consultorios, setConsultorios] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const handleConsultorios = async () => {
        setLoading(true);
        try {
            const result = await listarConsultorios();
            if (result.succes) {
                setConsultorios(result.data);
            } else {
                Alert.alert("Error", result.message || "Error al cargar consultorios");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los consultorios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', handleConsultorios);
        return unsubscribe;
    }, [navigation]);

    const handleEditar = (paciente) => {
        navigation.navigate('EditarConsultorios', { paciente });
    };

    const handleCrearConsultorios = () => {
        navigation.navigate('EditarConsultorios');
    };

    const handleEliminar = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este consultorio?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await EliminarConsultorio(id);
                            if (result.succes) {
                               setConsultorios(consultorios.filter(consultorios => consultorios.id !== id));
                            } else {
                                Alert.alert("Error", result.message || "Error al eliminar consultorios");
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el consultorios");
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={pacientes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PacientesCard
                        paciente={item}
                        onEdit={() => handleEditar(item)}
                        onDelete={() => handleEliminar(item.id)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.empty}>No hay consultorios registrados.</Text>}
            />
            <TouchableOpacity style={styles.botoncrear} onPress={handleCrearConsultorios}>
                <Text style={styles.textoboton}>Crear Consultorios</Text>
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
