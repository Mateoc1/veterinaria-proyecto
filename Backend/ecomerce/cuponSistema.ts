import { Carrito } from "./carrito.js";

const cuponesValidos: string[] = JSON.parse(
  localStorage.getItem("cupones") || '["vte10", "perro"]'
);

let cuponAplicado: string | null = null;

// aplica el descuento sobre el total del carrito
export function aplicarDescuento(carrito: Carrito): number {
  const total = carrito.obtenerTotal();

  if (!cuponAplicado) return total;

  // 20% de descuento si es válido
  return total * 0.8;
}

export function intentarAplicarCupon(code: string): string {
  code = code.trim().toLowerCase();

  if (cuponesValidos.includes(code)) {
    cuponAplicado = code;
    return "Cupón válido. Se aplicó un 20% de descuento.";
  }

  cuponAplicado = null;
  return "Cupón inválido.";
}

export function getCuponActual() {
  return cuponAplicado;
}
