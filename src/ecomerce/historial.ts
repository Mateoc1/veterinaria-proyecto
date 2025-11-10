import { Producto } from "./producto";

export interface Compra {
  id: number; // identificador único de la compra
  fecha: Date;
  productos: { id: number; nombre: string; precio: number; cantidad: number }[];
  total: number;
}

export class Historial {
  private compras: Compra[] = [];
  private contadorId = 1;

  registrarCompra(
    productos: { id: number; nombre: string; precio: number; cantidad: number }[]
  ): Compra {
    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const nuevaCompra: Compra = {
      id: this.contadorId++,
      fecha: new Date(),
      productos,
      total,
    };
    this.compras.push(nuevaCompra);
    return nuevaCompra;
  }

  listarCompras(): Compra[] {
    return this.compras;
  }

  obtenerCompraPorId(id: number): Compra | undefined {
    return this.compras.find(c => c.id === id);
  }

  obtenerTotalGastado(): number {
    return this.compras.reduce((acc, c) => acc + c.total, 0);
  }
}
