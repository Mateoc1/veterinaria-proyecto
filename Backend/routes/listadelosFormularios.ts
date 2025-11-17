interface Formulario {
    id: string;
    cliente_nombre: string;
    nombre_mascota: string;
    estado: string;
}

function obtenerlosFormularios(): Formulario[] {
    return JSON.parse(localStorage.getItem("formularios") || "[]");
}

document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");

    if (!tbody) return;

    const formularios = obtenerlosFormularios();

    tbody.innerHTML = "";

    formularios.forEach(f => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td data-label="Cliente">${f.cliente_nombre}</td>
            <td data-label="Mascota">${f.nombre_mascota}</td>
            <td data-label="Fecha">${new Date().toISOString().split("T")[0]}</td>
            <td data-label="Estado"><span class="estado pendiente">${f.estado}</span></td>
            <td data-label="Acciones">
                <a class="btn-ver" href="adicion-detalle.html?id=${f.id}">Ver</a>
            </td>
        `;

        tbody.appendChild(tr);
    });
});
