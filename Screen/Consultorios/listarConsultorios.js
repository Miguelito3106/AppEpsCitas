import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { listarConsultorios, eliminarConsultorios } from '../../Src/Services/ConsultoriosService';
import { useNavigation } from '@react-navigation/native';
import ConsultoriosCard from '../../Components/ConsultoriosCard';
import { useEffect, useState } from 'react';

export default function ListarConsultorios() {
    const [consultorios, setConsultorios] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const loadConsultorios = async () => {
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
        const unsubscribe = navigation.addListener('focus', loadConsultorios);
        return unsubscribe;
    }, [navigation]);

    const handleEditar = (consultorio) => {
        navigation.navigate('EditarConsultorios', { consultorio });
    };

    const handleCrearConsultorio = () => {
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
                            const result = await eliminarConsultorios(id);
                            if (result.succes) {
                                setConsultorios(consultorios.filter(consultorio => consultorio.id !== id));
                            } else {
                                Alert.alert("Error", result.message || "Error al eliminar consultorio");
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el consultorio");
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
        <View style={styles.container}>
            <FlatList
                data={consultorios}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                renderItem={({ item }) => (
                    <ConsultoriosCard
                        consultorio={item}
                        onEdit={() => handleEditar(item)}
                        onDelete={() => handleEliminar(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No hay consultorios registrados.</Text>
                }
            />
            <TouchableOpacity style={styles.botonCrear} onPress={handleCrearConsultorio}>
                <Text style={styles.textoBoton}>Crear Consultorio</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    botonCrear: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: "center",
    },
    textoBoton: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});