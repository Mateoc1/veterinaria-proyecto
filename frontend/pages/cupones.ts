/**
 * Página de Gestión de Cupones - Lógica del cliente
 */

import { couponService } from "../services/couponService";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

const formAgregarCupon = qs<HTMLFormElement>("#agregarCuponForm");
const inputNuevoCupon = qs<HTMLInputElement>("#nuevoCupon");
const mensajeCupon = qs<HTMLElement>("#mensajeCupon");
const listaCupones = qs<HTMLElement>("#listaCupones");

async function mostrarCupones(): Promise<void> {
  if (!listaCupones) return;

  listaCupones.innerHTML = "";
  const cupones = await couponService.loadCoupons();
  
  cupones.forEach((c: string) => {
    const li = document.createElement("li");
    li.textContent = c;
    
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", async () => {
      const result = await couponService.deleteCoupon(c);
      mensajeCupon.textContent = result.message;
      if (result.success) {
        await mostrarCupones();
      }
    });
    
    li.appendChild(btnEliminar);
    listaCupones.appendChild(li);
  });
}

if (formAgregarCupon && inputNuevoCupon && mensajeCupon) {
  formAgregarCupon.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const nuevo = inputNuevoCupon.value.trim().toLowerCase();

    if (!nuevo) {
      mensajeCupon.textContent = "Ingresa un cupón válido.";
      return;
    }

    const result = await couponService.createCoupon(nuevo);
    mensajeCupon.textContent = result.message;
    
    if (result.success) {
      inputNuevoCupon.value = "";
      await mostrarCupones();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await mostrarCupones();
});

