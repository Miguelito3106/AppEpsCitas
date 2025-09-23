import { obtenerCitas, actualizarCita } from './funcionesCitas.js';

// editarCitas.js

// Importa las funciones necesarias desde otros módulos

// Función principal para editar citas
async function editarCita(citaId) {
    try {
        // Obtiene la cita específica que se va a editar
        const cita = await obtenerCitas(citaId);

        // Verifica si se encontró la cita
        if (!cita) {
            console.error('Cita no encontrada.');
            return;
        }

        // Obtiene los elementos del formulario
        const form = document.getElementById('editarCitaForm');
        const pacienteInput = document.getElementById('paciente');
        const fechaInput = document.getElementById('fecha');
        const horaInput = document.getElementById('hora');
        const medicoInput = document.getElementById('medico');
        const especialidadInput = document.getElementById('especialidad');

        // Llena el formulario con los datos de la cita
        pacienteInput.value = cita.paciente;
        fechaInput.value = cita.fecha;
        horaInput.value = cita.hora;
        medicoInput.value = cita.medico;
        especialidadInput.value = cita.especialidad;

        // Agrega un event listener al formulario para manejar la actualización
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

            // Obtiene los nuevos valores del formulario
            const nuevoPaciente = pacienteInput.value;
            const nuevaFecha = fechaInput.value;
            const nuevaHora = horaInput.value;
            const nuevoMedico = medicoInput.value;
            const nuevaEspecialidad = especialidadInput.value;

            // Crea un objeto con los datos actualizados
            const citaActualizada = {
                id: citaId,
                paciente: nuevoPaciente,
                fecha: nuevaFecha,
                hora: nuevaHora,
                medico: nuevoMedico,
                especialidad: nuevaEspecialidad,
            };

            try {
                // Llama a la función para actualizar la cita en la base de datos
                await actualizarCita(citaActualizada);

                // Muestra un mensaje de éxito
                alert('Cita actualizada correctamente.');

                // Redirige a la página de lista de citas o realiza alguna otra acción
                window.location.href = 'listaCitas.html'; // Reemplaza con la URL correcta
            } catch (error) {
                console.error('Error al actualizar la cita:', error);
                alert('Error al actualizar la cita. Por favor, inténtalo de nuevo.');
            }
        });
    } catch (error) {
        console.error('Error al obtener la cita:', error);
        alert('Error al obtener la cita. Por favor, inténtalo de nuevo.');
    }
}

// Obtiene el ID de la cita de la URL (ejemplo: editarCita.html?id=123)
function obtenerIdCitaDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Llama a la función principal para editar la cita cuando la página se carga
window.addEventListener('load', () => {
    const citaId = obtenerIdCitaDeUrl();
    if (citaId) {
        editarCita(citaId);
    } else {
        console.error('ID de cita no encontrado en la URL.');
        alert('ID de cita no encontrado en la URL.');
    }
});