import { Carrito } from "./carrito";
import { Producto } from "./producto";

const carrito = new Carrito();

// Obtiene elementos del DOM
const listaProductosHTML = document.querySelectorAll(".producto");
const carritoHTML = document.getElementById("carrito")!;
const totalHTML = document.getElementById("total")!;
const btnVaciar = document.getElementById("vaciar")!;
const btnComprar = document.getElementById("comprar")!;

// -------------------------
// Función para renderizar carrito
// -------------------------
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

  totalHTML.textContent = carrito.obtenerTotal().toString();
}

// -------------------------
// Agregar productos
// -------------------------
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

// -------------------------
// Vaciar carrito
// -------------------------
btnVaciar.addEventListener("click", () => {
  carrito.vaciarCarrito();
  renderCarrito();
});

// -------------------------
// Comprar
// -------------------------
btnComprar.addEventListener("click", () => {
  alert("Compra procesada!");
  carrito.vaciarCarrito();
  renderCarrito();
});
