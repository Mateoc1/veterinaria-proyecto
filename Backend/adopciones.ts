interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  foto?: string;
  adoptable: boolean;
}

const listaMascotasEl = document.getElementById("listaMascotas") as HTMLDivElement;
const listaAdopcionesEl = document.getElementById("listaAdopciones") as HTMLDivElement;
const formulario = document.getElementById("formularioAgregar") as HTMLFormElement;
const inputNombre = document.getElementById("inputNombre") as HTMLInputElement;
const inputEspecie = document.getElementById("inputEspecie") as HTMLInputElement;
const inputFoto = document.getElementById("inputFoto") as HTMLInputElement;
const inputAdoptable = document.getElementById("inputAdoptable") as HTMLInputElement;
const filtroAdoptables = document.getElementById("filtroAdoptables") as HTMLInputElement;
const avisoPerfil = document.getElementById("avisoPerfil") as HTMLDivElement;


const STORAGE_KEY = "vet_mascotas_v1";


let mascotas: Mascota[] = [];


function generarId(): string {
  return "m-" + Math.random().toString(36).slice(2, 9);
}


function guardarEnLocal(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
  } catch (e) {
    console.warn("No se pudo guardar en localStorage", e);
  }
}


function cargarDesdeLocal(): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Mascota[];
      mascotas = parsed;
      return;
    } catch {
      mascotas = [];
    }
  }

  // ESTOS SON EJEMPLOS PARA TENER ALGO DE UI, LOS SACO DESPUES, NO ROMPAN LOS HUEVOS
  mascotas = [
    { id: generarId(), nombre: "Rocco", especie: "Perro", foto: "", adoptable: false },
    { id: generarId(), nombre: "Nina", especie: "Perro", foto: "", adoptable: true },
    { id: generarId(), nombre: "Luna", especie: "Gato", foto: "", adoptable: true },
  ];
  guardarEnLocal();
}


function renderizarSelector(lista: Mascota[]) {
  listaMascotasEl.innerHTML = "";
  if (lista.length === 0) {
    avisoPerfil.style.display = "block";
  } else {
    avisoPerfil.style.display = "none";
  }
  for (const m of lista) {
    const div = document.createElement("div");
    div.className = "mascota";
    div.dataset.id = m.id;

    const img = document.createElement("img");
    img.src = m.foto && m.foto.trim() !== "" ? m.foto : `https://via.placeholder.com/120x78?text=${encodeURIComponent(m.nombre)}`;
    const name = document.createElement("small");
    name.textContent = m.nombre;

    div.appendChild(img);
    div.appendChild(name);
    div.addEventListener("click", () => {

      const previo = listaMascotasEl.querySelector(".mascota.seleccionada");
      if (previo) previo.classList.remove("seleccionada");
      div.classList.add("seleccionada");
    });
    listaMascotasEl.appendChild(div);
  }
}


function renderizarAdopciones(lista: Mascota[]) {
  listaAdopcionesEl.innerHTML = "";
  if (lista.length === 0) {
    const p = document.createElement("div");
    p.textContent = "No hay animales para mostrar.";
    listaAdopcionesEl.appendChild(p);
    return;
  }
  for (const m of lista) {
    const item = document.createElement("div");
    item.className = "cardAdop";
    item.dataset.id = m.id;
    const img = document.createElement("img");
    img.src = m.foto && m.foto.trim() !== "" ? m.foto : `https://via.placeholder.com/120x78?text=${encodeURIComponent(m.nombre)}`;
    const info = document.createElement("div");
    info.style.flex = "1";
    info.innerHTML = `<strong>${escapeHtml(m.nombre)}</strong><br><small>${escapeHtml(m.especie)} ${m.adoptable ? "• Adoptable" : ""}</small>`;
    const acciones = document.createElement("div");
    acciones.style.display = "flex";
    acciones.style.gap = "6px";

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "boton";
    btnEliminar.addEventListener("click", () => {
      eliminarMascota(m.id);
    });
    acciones.appendChild(btnEliminar);
    item.appendChild(img);
    item.appendChild(info);
    item.appendChild(acciones);
    listaAdopcionesEl.appendChild(item);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c] || c));
}



function agregarMascotaDesdeFormulario(ev?: Event) {
  if (ev) ev.preventDefault();
  const nombre = inputNombre.value.trim();
  const especie = inputEspecie.value.trim();
  const foto = inputFoto.value.trim();
  const adoptable = inputAdoptable.checked;
  if (!nombre || !especie) {
    alert("Completa nombre y especie");
    return;
  }
  const nueva: Mascota = {
    id: generarId(),
    nombre,
    especie,
    foto,
    adoptable,
  };
  mascotas.push(nueva);
  guardarEnLocal();
  limpiarFormulario();
  actualizarVistas();
}


function eliminarMascota(id: string) {
  const idx = mascotas.findIndex(m => m.id === id);
  if (idx === -1) return;

  const ok = confirm(`Eliminar a ${mascotas[idx].nombre}?`);
  if (!ok) return;
  mascotas.splice(idx, 1);
  guardarEnLocal();
  actualizarVistas();
}




function obtenerListaFiltrada(): Mascota[] {
  if (filtroAdoptables.checked) {
    return mascotas.filter(m => m.adoptable);
  }
  return mascotas.slice();
}


function actualizarVistas() {
  const lista = obtenerListaFiltrada();
  renderizarSelector(lista);
  renderizarAdopciones(lista);
}

function limpiarFormulario() {
  inputNombre.value = "";
  inputEspecie.value = "";
  inputFoto.value = "";
  inputAdoptable.checked = false;
}


function iniciarApp() {
  cargarDesdeLocal();
  actualizarVistas();


  formulario.addEventListener("submit", (e) => {
    agregarMascotaDesdeFormulario(e);
  });


  const btnLimpiar = document.getElementById("btnLimpiar") as HTMLButtonElement;
  btnLimpiar.addEventListener("click", () => {
    limpiarFormulario();
  });


  filtroAdoptables.addEventListener("change", () => {
    actualizarVistas();
  });

 
  const btnSolicitar = document.getElementById("btnSolicitar") as HTMLButtonElement;
  const motivoEl = document.getElementById("motivo") as HTMLTextAreaElement;
  btnSolicitar.addEventListener("click", () => {
    const seleccionado = listaMascotasEl.querySelector(".mascota.seleccionada") as HTMLElement | null;
    const motivo = motivoEl.value.trim();
    if (!seleccionado) {
      alert("Seleccioná una mascota antes de solicitar la consulta.");
      return;
    }
    const id = seleccionado.dataset.id!;
    const mascota = mascotas.find(m => m.id === id);
    if (!mascota) {
      alert("Mascota no encontrada.");
      return;
    }
  // LUCAS, DESPUES USA ESTA PARTESITA PARA CONECTARLO A LA BD, YO AHORA LO TENGO EN LOCAL STORAGE
  // PORQUE NI PUTA IDEA COMO CONECTARLO A TU BD
    const registrosRaw = localStorage.getItem("vet_consultas") || "[]";
    const registros = JSON.parse(registrosRaw);
    registros.push({
      id: "c-" + Date.now(),
      mascotaId: mascota.id,
      mascotaNombre: mascota.nombre,
      motivo,
      fecha: new Date().toISOString()
    });
    localStorage.setItem("vet_consultas", JSON.stringify(registros));
    alert("Consulta registrada para " + mascota.nombre + ". (Registro local guardado)");
    motivoEl.value = "";
  });
}

document.addEventListener("DOMContentLoaded", iniciarApp);
