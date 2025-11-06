let cupon: string[] = JSON.parse(localStorage.getItem('cupones') || '[]') || ["vte10", "perro"];

if (cupon.length === 0) {
  cupon = ["vte10", "perro"];
}

const formAgregarCupon = document.getElementById('agregarCuponForm') as HTMLFormElement | null;
const inputNuevoCupon = document.getElementById('nuevoCupon') as HTMLInputElement | null;
const mensajeCupon = document.getElementById('mensajeCupon') as HTMLElement | null;
const listaCupones = document.getElementById('listaCupones') as HTMLElement | null;

function guardarCupones(): void {
  localStorage.setItem('cupones', JSON.stringify(cupon));
}

function mostrarCupones(): void {
  if (!listaCupones) return;

  listaCupones.innerHTML = '';
  cupon.forEach((c: string) => {
    const li = document.createElement('li');
    li.textContent = c;
    listaCupones.appendChild(li);
  });
}

mostrarCupones();

if (formAgregarCupon && inputNuevoCupon && mensajeCupon) {
  formAgregarCupon.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const nuevo = inputNuevoCupon.value.trim().toLowerCase();

    if (!nuevo) {
      mensajeCupon.textContent = "Ingresa un cupón válido.";
      return;
    }

    if (cupon.includes(nuevo)) {
      mensajeCupon.textContent = `El cupón "${nuevo}" ya existe.`;
      return;
    }

    cupon.push(nuevo);
    guardarCupones();
    mostrarCupones();

    mensajeCupon.textContent = `Cupón "${nuevo}" agregado correctamente.`;
    inputNuevoCupon.value = "";
  });
}
