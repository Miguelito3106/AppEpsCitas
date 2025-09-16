import {createStackNAvigator} from '@react-navigation/stack';
import listarCitas from '../../Screens/Citas/ListarCitas';
import detalleCita from '../../Screens/Citas/DetalleCita';
import editarCita from '../../Screens/Citas/EditarCita';

const stack = createStackNAvigator();

export default function CitasStack() {
    return(
        <stack.Navigator>
            <stack.Screen
                name="listarCitas"
                component={listarCitas}
                options={{title: 'Citas'}}
            />
            <stack.Screen   
                name="detalleCita"
                component={detalleCita}
                options={{title: 'Detalle de la Cita'}}
            />
            <stack.Screen   
                name="editarCita"
                component={editarCita}
                options={{title: 'Editar Cita'}}
            />
        </stack.Navigator>
    )
}