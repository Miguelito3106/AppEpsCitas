import PacientesStack from "./PacientesStack";
import CitasStack from "./CitasStack";
import ConsultoriosStack from "./ConsultoriosStack"
import HorariosMedicosStack from "./HorariosMedicosStack"
import MedicosStack from "./MedicosStack"

const Stack = createNativeStackNavigator();

export default function InicioStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="inicio"
                component={Inicio}
                options={{ title: "Inicio" }}
            />
            <Stack.Screen
                name="Citas"
                component={CitasStack}
                options={{ title: "Citas" }}
            />
            <Stack.Screen
                name="Consultorios"
                component={ConsultoriosStack}
                options={{ title: "Consultorios" }}
            />
            <Stack.Screen
                name="HorariosMedicos"
                component={HorariosMedicosStack}
                options={{ title: "HorariosMedicos" }}
            />
            <Stack.Screen
                name="Medicos"
                component={MedicosStack}
                options={{ title: "Medicos" }}
            />
            <Stack.Screen
                name="Pacientes"
                component={PacientesStack}
                options={{ title: "Pacientes" }}
            />
        </Stack.Navigator>
    )
}