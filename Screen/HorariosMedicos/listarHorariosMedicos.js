import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { listarHorariosMedicos, eliminarHorariosMedicos } from '../../Src/Services/HorariosMedicosService';
import { useNavigation } from '@react-navigation/native';
import HorariosMedicosCard from '../../Components/HorariosMedicosCard';
import { useEffect, useState } from 'react';

export default function ListarHorariosMedicos() {
    const [horarios, setHorarios] = useState([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    const handleHorarios = async () => {
        setLoading(true);
        try {
            const result = await listarHorariosMedicos();
            if (result.success) {
                setHorarios(result.data);
            } else {
                Alert.alert("Error", result.message || "Error al cargar horarios");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los horarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleHorarios();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', handleHorarios);
        return unsubscribe;
    }, [navigation]);

    const handleEditar = (horario) => {
        navigation.navigate('HorariosMedicosStack', {
            screen: 'EditarHorariosMedicos',
            params: { horario }
        });
    };

    const handleCrearHorario = () => {
        navigation.navigate('HorariosMedicosStack', {
            screen: 'EditarHorariosMedicos'
        });
    };

    const handleEliminar = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar este horario?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await eliminarHorariosMedicos(id);
                            if (result.success) {
                                handleHorarios();
                            } else {
                                Alert.alert("Error", result.message || "Error al eliminar horario");
                            }
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el horario");
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
                data={horarios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <HorariosMedicosCard
                        horario={item}
                        onEdit={() => handleEditar(item)}
                        onDelete={() => handleEliminar(item.id)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.empty}>No hay horarios registrados.</Text>}
            />
            <TouchableOpacity style={styles.botoncrear} onPress={handleCrearHorario}>
                <Text style={styles.textoboton}>Crear Horario</Text>
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
