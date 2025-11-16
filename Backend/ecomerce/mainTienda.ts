import { Carrito } from "./carrito";
import { Producto } from "./producto";
import { CuponSistema } from "./cuponSistema";

const carrito = new Carrito();
const cuponSistema = new CuponSistema();

// Obtiene elementos del DOM
const listaProductosHTML = document.querySelectorAll(".producto");
const carritoHTML = document.getElementById("carrito")!;
const totalHTML = document.getElementById("total")!;
const btnVaciar = document.getElementById("vaciar")!;
const btnComprar = document.getElementById("comprar")!;

// Función para renderizar carrito
function renderCarrito() {
  const items = carrito.listarProductos();

  if (items.length === 0) {
    carritoHTML.innerHTML = `<p>El carrito está vacío.</p>`;
  } else {
    carritoHTML.innerHTML = items
      .map(
        (p) =>
          `<p>${p.nombre} x${p.cantidad} — $${p.precio * p.cantidad}</p>`
      )
      .join("");
  }

  // Total con descuento (si hay cupón)
  const totalConDescuento = cuponSistema.aplicarDescuento(carrito);
  totalHTML.textContent = totalConDescuento.toString();
}

// Agregar productos
listaProductosHTML.forEach((div) => {
  const id = Number(div.getAttribute("data-id"));
  const name = div.querySelector("h3")!.textContent!;
  const price = Number(
    div.querySelector("p")!.textContent!.replace("Precio: $", "")
  );

  const producto = new Producto(id, name, price);

  const btn = div.querySelector(".btn-agregar")!;
  btn.addEventListener("click", () => {
    carrito.agregarProducto(producto, 1);
    renderCarrito();
  });
});

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  carrito.vaciarCarrito();
  cuponSistema.removerCupon();
  renderCarrito();
});

// Comprar con MercadoPago
btnComprar.addEventListener("click", async () => {
  const productos = carrito.listarProductos();
  if (productos.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  try {
    const response = await fetch('/api/pago/crear-preferencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productos,
        total: cuponSistema.aplicarDescuento(carrito)
      })
    });

    const data = await response.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert('Error al procesar el pago');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
});

const btnAplicarCupon = document.getElementById("aplicar-cupon")!;
const cuponInput = document.getElementById("cupon") as HTMLInputElement;
const msgCupon = document.getElementById("msg-cupon")!;

btnAplicarCupon.addEventListener("click", () => {
  const code = cuponInput.value;
  const resultado = cuponSistema.intentarAplicarCupon(code);

  msgCupon.textContent = resultado.mensaje;
  msgCupon.style.color = resultado.valido ? 'green' : 'red';

  // Actualiza el total con el descuento aplicado
  renderCarrito();
});

// Inicializar
renderCarrito();
