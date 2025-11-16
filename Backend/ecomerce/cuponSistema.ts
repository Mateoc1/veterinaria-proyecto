import { Carrito } from "./carrito";

// Cupones válidos del sistema
const cuponesValidos: { [key: string]: number } = {
  "vte10": 0.1,    // 10% descuento
  "perro": 0.2,    // 20% descuento
  "gato": 0.15,    // 15% descuento
  "veterinaria": 0.25  // 25% descuento
};

export class CuponSistema {
  private cuponAplicado: string | null = null;

  // Aplica el descuento sobre el total del carrito
  aplicarDescuento(carrito: Carrito): number {
    const total = carrito.obtenerTotal();
    
    if (!this.cuponAplicado || !cuponesValidos[this.cuponAplicado]) {
      return total;
    }

    const descuento = cuponesValidos[this.cuponAplicado];
    return total * (1 - descuento);
  }

  // Intenta aplicar un cupón
  intentarAplicarCupon(code: string): { valido: boolean; mensaje: string; descuento?: number } {
    const codigoLimpio = code.trim().toLowerCase();
    
    if (cuponesValidos[codigoLimpio]) {
      this.cuponAplicado = codigoLimpio;
      const descuentoPorcentaje = cuponesValidos[codigoLimpio] * 100;
      return {
        valido: true,
        mensaje: `Cupón válido. Se aplicó un ${descuentoPorcentaje}% de descuento.`,
        descuento: cuponesValidos[codigoLimpio]
      };
    }

    this.cuponAplicado = null;
    return {
      valido: false,
      mensaje: "Cupón inválido."
    };
  }

  // Obtiene el cupón actual
  getCuponActual(): string | null {
    return this.cuponAplicado;
  }

  // Remueve el cupón aplicado
  removerCupon(): void {
    this.cuponAplicado = null;
  }

  // Obtiene todos los cupones disponibles (para admin)
  static getCuponesDisponibles(): { [key: string]: number } {
    return { ...cuponesValidos };
  }
}
