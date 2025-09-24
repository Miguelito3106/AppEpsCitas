import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function PacientesCard({paciente, onEdit, onDelete}) {

    return (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{paciente.nombre}</Text>
                <Text style={styles.detail}>apellido: {paciente.apellido}</Text>
                <Text style={styles.detail}>documento: {paciente.documento}</Text>
                <Text style={styles.detail}>fecha_nacimiento: {paciente.fecha_nacimiento}</Text>
                <Text style={styles.detail}>telefono: {paciente.telefono}</Text>
                <Text style={styles.detail}>genero: {paciente.fecha_genero}</Text>
        </View>    
        <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Ionicons name="pencil" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
        </View>    
    </View>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
},
    info: {
        flex: 1,
},
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
},
    detalle: {
        fontSize: 14,
        color: '#555',  
    },
    botonCrear: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
    }, 
    textoBoton: {
        color: '#fff',
        fontSize: 16,
    }

});

