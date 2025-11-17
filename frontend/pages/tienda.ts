/**
 * Página de Tienda - Lógica del cliente
 */

import { Producto } from "../models/Producto.js";
import { cartService } from "../services/cartService.js";
import { couponService } from "../services/couponService.js";

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Elemento no encontrado: ${sel}`);
  return el as T;
}

// Obtiene elementos del DOM
const listaProductosContainer = qs<HTMLDivElement>("#lista-productos");
const carritoHTML = qs<HTMLDivElement>("#carrito");
const totalHTML = qs<HTMLSpanElement>("#total");
const btnVaciar = qs<HTMLButtonElement>("#vaciar");
const btnComprar = qs<HTMLButtonElement>("#comprar");
const btnAplicarCupon = qs<HTMLButtonElement>("#aplicar-cupon");
const cuponInput = qs<HTMLInputElement>("#cupon");
const msgCupon = qs<HTMLParagraphElement>("#msg-cupon");

// Cargar productos desde la API
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    const result = await response.json();
    
    if (result.ok) {
      renderProducts(result.data);
    } else {
      console.error("Error al cargar productos:", result.error);
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// Renderizar productos en el DOM
function renderProducts(products: any[]) {
  listaProductosContainer.innerHTML = products.map(product => `
    <div class="producto" data-id="${product.id}">
      <h3>${product.nombre}</h3>
      <p>Precio: $${product.precio}</p>
      <p>Stock: ${product.stock}</p>
      <button class="btn-agregar">Agregar al carrito</button>
    </div>
  `).join("");
  
  // Agregar event listeners a los botones
  const productElements = document.querySelectorAll(".producto");
  productElements.forEach((div) => {
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
}

// Función para renderizar carrito
function renderCarrito() {
  const items = cartService.listarProductos();

  if (items.length === 0) {
    carritoHTML.innerHTML = `<p>El carrito está vacío.</p>`;
  } else {
    carritoHTML.innerHTML = items
      .map(
        (p: any) =>
          `<p>${p.nombre} x${p.cantidad} — $${p.precio * p.cantidad}</p>`
      )
      .join("");
  }

  // Total con descuento (si hay cupón)
  const total = cartService.obtenerTotal();
  const totalConDescuento = couponService.aplicarDescuento(total);

  totalHTML.textContent = totalConDescuento.toFixed(2);
}



// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  cartService.vaciarCarrito();
  renderCarrito();
});

// Comprar
btnComprar.addEventListener("click", async () => {
  try {
    const items = cartService.listarProductos();
    if (items.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    // Sincronizar carrito con el backend
    for (const item of items) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: item.id,
          quantity: item.cantidad
        })
      });
    }

    // Crear preferencia de pago
    const response = await fetch("/api/payments/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    const result = await response.json();
    
    if (result.ok) {
      // Redirigir a MercadoPago
      window.location.href = result.data.sandbox_init_point || result.data.init_point;
    } else {
      alert("Error: " + result.error);
    }
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
  loadProducts();
  renderCarrito();
  
  // Verificar si hay mensaje de pago en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  
  if (paymentStatus === 'success') {
    alert('¡Pago realizado con éxito!');
    cartService.vaciarCarrito();
    renderCarrito();
  } else if (paymentStatus === 'failure') {
    alert('El pago no pudo ser procesado.');
  } else if (paymentStatus === 'pending') {
    alert('El pago está pendiente de confirmación.');
  }
});

