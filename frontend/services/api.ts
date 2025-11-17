/**
 * Capa de servicios API para el frontend
 * Abstrae todas las llamadas al servidor
 */

// En producción, esto debería venir de una variable de entorno del build
// Por ahora usamos una constante
const API_BASE = (window as any).API_BASE_URL || "http://localhost:3001";

interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...((options as any).headers || {}),
        },
        credentials: "include",
      });

      // try parse JSON safely
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {
        data = null;
      }

      if (!response.ok) {
        return {
          ok: false,
          error: data?.error || data?.message || response.statusText || "Error en la petición",
        };
      }

      return {
        ok: true,
        data: (data && (data.data ?? data)) as T,
      };
    } catch (error: any) {
      return {
        ok: false,
        error: error?.message || "Error de conexión",
      };
    }
  }

  // ============ AUTH ============
  async login(email: string, password: string) {
    return this.request("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    name?: string;
    lastname?: string;
    email: string;
    password: string;
  }) {
    return this.request("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request("/api/logout", {
      method: "POST",
    });
  }

  async getSession() {
    return this.request<{ loggedIn: boolean; user?: { id: number; email: string } }>("/api/session");
  }

  async forgotPassword(email: string) {
    return this.request("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // ============ PRODUCTOS ============
  async getProducts() {
    return this.request<any[]>("/api/products");
  }

  async getProduct(id: number) {
    return this.request(`/api/products/${id}`);
  }

  // ============ CARRITO ============
  async getCart() {
    return this.request<any>("/api/cart");
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number) {
    return this.request(`/api/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(productId: number) {
    return this.request(`/api/cart/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request("/api/cart", {
      method: "DELETE",
    });
  }

  // ============ CUPONES ============
  async getCoupons() {
    return this.request<string[]>("/api/coupons");
  }

  async validateCoupon(code: string) {
    return this.request<{ valid: boolean; discount: number }>("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async createCoupon(code: string) {
    return this.request("/api/coupons", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  async deleteCoupon(code: string) {
    return this.request(`/api/coupons/${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
  }

  // ============ ADOPCIONES ============
  async getPets() {
    return this.request<any[]>("/api/pets");
  }

  async getPet(id: string) {
    return this.request(`/api/pets/${id}`);
  }

  async createPet(data: {
    nombre: string;
    especie: string;
    foto?: string;
    adoptable: boolean;
  }) {
    return this.request("/api/pets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePet(id: string, data: Partial<{
    nombre: string;
    especie: string;
    foto?: string;
    adoptable: boolean;
  }>) {
    return this.request(`/api/pets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePet(id: string) {
    return this.request(`/api/pets/${id}`, {
      method: "DELETE",
    });
  }

  // ============ APPOINTMENTS ============
  async createAppointment(data: {
    petId: string;
    motivo: string;
  }) {
    return this.request("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAppointments() {
    return this.request<any[]>("/api/appointments");
  }

  // ============ FORMULARIO ============
async createForm(data: {
    nombre?: string;
    apellido?: string;
    telefono?: number;
    mail?: string;
    fecha_nacimiento?: string;
    direccion?: string;
    ciudad?: string;
    provincia?: string;
    codigo_postal?: number;
    pais?: string;
    tipo_documento?: string;
    numero_documento?: number;
    tipo_vivienda: string;
    espacio_seguro: string;
    tiempo_solo: number;
    personas_encasa: number;
    familia_deacuerdo: string;
    otras_mascotas_anteriormente: string;
    tipo: string;
    eventos: string;
    otras_mascotas_actualmente: number;
    tipo_mascotas_actual: string;
    recursos: string;
    vacunar_y_esterilizar: string;
    encargado_cuidado: string;
    sitio_animal_solo: string;
    rol_del_animal: string;
    estado: string;
  }) {
    return this.request("/api/formulario", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

}

export const api = new ApiClient();
export default api;

