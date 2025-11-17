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

    estado: string; // siempre 'pendiente'
}

function obtenciondeFormularios(): Formulario[] {
    return JSON.parse(localStorage.getItem("formularios") || "[]");
}

function guardarFormularios(lista: Formulario[]) {
    localStorage.setItem("formularios", JSON.stringify(lista));
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form") as HTMLFormElement;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(form);

        const nuevo: Formulario = {
            id: crypto.randomUUID(),

            cliente_nombre: data.get("cliente_nombre")!.toString(),
            cliente_email: data.get("cliente_email")!.toString(),
            cliente_telefono: data.get("cliente_telefono")!.toString(),

            id_mascota: data.get("id_mascota")!.toString(),
            nombre_mascota: data.get("nombre_mascota")!.toString(),

            tiene_mascotas: data.get("tiene_mascotas")!.toString(),
            cuantas_mascotas: data.get("cuantas_mascotas")!.toString(),

            motivo_adopcion: data.get("motivo_adopcion")!.toString(),
            espacio_disponible: data.get("espacio_disponible")!.toString(),
            convivientes: data.get("convivientes")!.toString(),
            edad_convivientes: data.get("edad_convivientes")!.toString(),
            situacion_laboral: data.get("situacion_laboral")!.toString(),
            horas_solo: data.get("horas_solo")!.toString(),
            sitio_animal_solo: data.get("sitio_animal_solo")!.toString(),
            rol_del_animal: data.get("rol_del_animal")!.toString(),

            estado: "pendiente"
        };

        const lista = obtenciondeFormularios();
        lista.push(nuevo);
        guardarFormularios(lista);

        window.location.href = "listadelosformularios.html";
    });
});
