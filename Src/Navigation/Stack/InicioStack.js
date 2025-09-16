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
                component={Categorias}
                options={{ title: "Citas" }}
            />
            <Stack.Screen
                name="Consultorios"
                component={Cita}
                options={{ title: "Consultorios" }}
            />
            <Stack.Screen
                name="HorariosMedicos"
                component={Especialistas}
                options={{ title: "HorariosMedicos" }}
            />
            <Stack.Screen
                name="Medicos"
                component={ReservarCita}
                options={{ title: "Medicos" }}
            />
            <Stack.Screen
                name="Pacientes"
                component={ReservarCita}
                options={{ title: "Pacientes" }}
            />
        </Stack.Navigator>
    )
}