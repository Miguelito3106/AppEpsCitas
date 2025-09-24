import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { listarPacientes, EliminarPaciente } from '../../Src/Services/PacienteService';
import { useNavigation } from '@react-navigation/native';
import PacientesCard from '../../Components/PacientesCard';
import { useEffect, useState } from 'react';

export default function ListarPacientes() {
    const [pacientes, setPacientes] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const handlePacientes = async () => {
        setLoading(true);
        try {
            const result = await listarPacientes();
            if (result.succes) {
                setPacientes(result.data);
            } else {
                Alert.alert("Error", result.message || "Error al cargar pacientes");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los pacientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', handlePacientes);
        return unsubscribe;
    }, [navigation]);

    const handleEditar = (paciente) => {
        navigation.navigate('EditarPacientes', { paciente });
    };

    const handleCrearPaciente = () => {
        navigation.navigate('AgregarPaciente');
    };

    const handleEliminar = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este paciente?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await EliminarPaciente(id);
                            if (result.succes) {
                                handlePacientes();
                            } else {
                                Alert.alert("Error", result.message || "Error al eliminar paciente");
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el paciente");
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
                ListEmptyComponent={<Text style={styles.empty}>No hay pacientes registrados.</Text>}
            />
            <TouchableOpacity style={styles.botoncrear} onPress={handleCrearPaciente}>
                <Text style={styles.textoboton}>Crear Paciente</Text>
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
