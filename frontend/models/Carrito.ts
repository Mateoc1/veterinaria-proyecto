/**
 * Modelo de Carrito
 */

import { Producto } from "./Producto.js";

export class Carrito {
  private productos: Map<number, { producto: Producto; cantidad: number }> = new Map();

  agregarProducto(producto: Producto, cantidad: number = 1): void {
    if (this.productos.has(producto.id)) {
      const item = this.productos.get(producto.id)!;
      item.cantidad += cantidad;
    } else {
      this.productos.set(producto.id, { producto, cantidad });
    }
  }

  eliminarProducto(id: number, cantidad: number = 1): void {
    const item = this.productos.get(id);
    if (!item) return;

    if (item.cantidad > cantidad) {
      item.cantidad -= cantidad;
    } else {
      this.productos.delete(id);
    }
  }

  obtenerTotal(): number {
    let total = 0;
    this.productos.forEach(({ producto, cantidad }) => {
      total += producto.precio * cantidad;
    });
    return total;
  }

  listarProductos(): { id: number; nombre: string; precio: number; cantidad: number }[] {
    const lista: { id: number; nombre: string; precio: number; cantidad: number }[] = [];
    this.productos.forEach(({ producto, cantidad }) => {
      lista.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
      });
    });
    return lista;
  }

  vaciarCarrito(): void {
    this.productos.clear();
  }

  obtenerCantidadTotal(): number {
    let total = 0;
    this.productos.forEach(item => total += item.cantidad);
    return total;
  }
}

