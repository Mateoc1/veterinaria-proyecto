const cupones: string[] = ["vte10", "perro"];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("compraForm") as HTMLFormElement;
    const resultado = document.getElementById("resultado") as HTMLElement;

    form.addEventListener("submit", (event) => {
        event.preventDefault();  // Evita que el formulario recargue la pagina al enviarlo

        const precioInput = document.getElementById("precio") as HTMLInputElement;
        const cantidadInput = document.getElementById("cantidad") as HTMLInputElement;
        const cuponInput = document.getElementById("cupon") as HTMLInputElement;

        const precio = parseFloat(precioInput.value);
        const cantidad = parseInt(cantidadInput.value);
        const cupon = cuponInput.value.trim();

        if (isNaN(precio) || isNaN(cantidad)) {
            resultado.textContent = "Por favor ingrese valores válidos.";
            return;
        }

        let compra = precio * cantidad;
        let descuento = 0;
        let mensaje = "";

        if (cupones.includes(cupon)) {
            descuento = compra * 0.1;
            mensaje = "Cupón válido aplicado (10% de descuento)";
        } else if (cupon.length > 0) {
            mensaje = "Cupón inválido (no se aplicó descuento)";
        } else {
            mensaje = "Sin cupón";
        }

        const total = compra - descuento;

        resultado.innerHTML = `
      <p>${mensaje}</p>
      <p>Subtotal: $${compra.toFixed(2)}</p>
      <p>Descuento: $${descuento.toFixed(2)}</p>
      <p><strong>Total a pagar: $${total.toFixed(2)}</strong></p>
    `;
    });
});
