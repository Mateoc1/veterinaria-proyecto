interface Formulario {
    id: string;

    cliente_nombre: string;
    cliente_email: string;
    cliente_telefono: string;

    id_mascota: string;
    nombre_mascota: string;

    tiene_mascotas: string;
    cuantas_mascotas: string;

    motivo_adopcion: string;
    espacio_disponible: string;
    convivientes: string;
    edad_convivientes: string;
    situacion_laboral: string;
    horas_solo: string;
    sitio_animal_solo: string;
    rol_del_animal: string;

    estado: string;
}

function obtenerFormularios(): Formulario[] {
    return JSON.parse(localStorage.getItem("formularios") || "[]");
}

function getParam(id: string): string | null {
    return new URLSearchParams(window.location.search).get(id);
}

document.addEventListener("DOMContentLoaded", () => {
    const id = getParam("id");
    const formulario = obtenerFormularios().find(f => f.id === id);

    if (!formulario) return;

    const infoSection = document.querySelector("section.card.info");

    if (!infoSection) return;

    // Seleccionar todos los <p> que NO contienen <strong>
    const valores = infoSection.querySelectorAll("p:not(:has(strong))");

    const data = [
        formulario.cliente_nombre,
        formulario.nombre_mascota,
        formulario.tiene_mascotas,
        formulario.cuantas_mascotas,
        formulario.motivo_adopcion,
        formulario.espacio_disponible,
        formulario.convivientes,
        formulario.edad_convivientes,
        formulario.situacion_laboral,
        formulario.horas_solo,
        formulario.sitio_animal_solo,
        formulario.rol_del_animal
    ];

    valores.forEach((p, i) => {
        if (data[i] !== undefined) p.textContent = data[i];
    });
});
