/**
 * Página de Tienda - Lógica del cliente
 */

import { Producto } from "../models/Producto";
import { cartService } from "../services/cartService";
import { couponService } from "../services/couponService";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

// Obtiene elementos del DOM
const listaProductosHTML = document.querySelectorAll(".producto");
const carritoHTML = qs<HTMLDivElement>("#carrito");
const totalHTML = qs<HTMLSpanElement>("#total");
const btnVaciar = qs<HTMLButtonElement>("#vaciar");
const btnComprar = qs<HTMLButtonElement>("#comprar");
const btnAplicarCupon = qs<HTMLButtonElement>("#aplicar-cupon");
const cuponInput = qs<HTMLInputElement>("#cupon");
const msgCupon = qs<HTMLParagraphElement>("#msg-cupon");

// Función para renderizar carrito
function renderCarrito() {
  const items = cartService.listarProductos();

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
  const total = cartService.obtenerTotal();
  const totalConDescuento = couponService.aplicarDescuento(total);

  totalHTML.textContent = totalConDescuento.toFixed(2);
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
    cartService.agregarProducto(producto, 1);
    renderCarrito();
  });
});

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  cartService.vaciarCarrito();
  renderCarrito();
});

// Comprar
btnComprar.addEventListener("click", async () => {
  try {
    // Aquí se podría integrar con la API para procesar la compra
    alert("Compra procesada!");
    cartService.vaciarCarrito();
    couponService.clearCoupon();
    cuponInput.value = "";
    msgCupon.textContent = "";
    renderCarrito();
  } catch (err: any) {
    alert("Error al procesar la compra: " + (err.message || "Error desconocido"));
  }
});

// Aplicar cupón
btnAplicarCupon.addEventListener("click", async () => {
  const code = cuponInput.value.trim();
  if (!code) {
    msgCupon.textContent = "Ingresa un código de cupón";
    return;
  }

  const result = await couponService.validateCoupon(code);
  msgCupon.textContent = result.message;

  // Actualiza el total con el descuento aplicado
  renderCarrito();
});

// Inicializar vista
document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
});

