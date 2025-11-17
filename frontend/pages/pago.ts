/**
 * Página de Pago - Lógica del cliente
 */

import { cartService } from "../services/cartService";
import { couponService } from "../services/couponService";
import { api } from "../services/api";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = qs<HTMLFormElement>("#compraForm");
  const resultado = qs<HTMLElement>("#resultado");
  const cuponInput = qs<HTMLInputElement>("#cupon");

  // Cargar datos del carrito
  const items = cartService.listarProductos();
  const subtotal = cartService.obtenerTotal();
  const totalConDescuento = couponService.aplicarDescuento(subtotal);
  const descuento = subtotal - totalConDescuento;

  if (form && resultado) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const cupon = cuponInput?.value.trim() || "";

      let mensaje = "";
      let descuentoAplicado = 0;

      if (cupon) {
        const result = await couponService.validateCoupon(cupon);
        mensaje = result.message;
        if (result.valid) {
          descuentoAplicado = subtotal * (result.discount / 100);
        }
      } else {
        mensaje = "Sin cupón";
      }

      const total = subtotal - descuentoAplicado;

      resultado.innerHTML = `
        <p>${mensaje}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Descuento: $${descuentoAplicado.toFixed(2)}</p>
        <p><strong>Total a pagar: $${total.toFixed(2)}</strong></p>
      `;
    });
  }
});

