/**
 * Servicio de cupones del cliente
 * Maneja la lógica de cupones en el frontend
 */

import { api } from "./api";

class CouponService {
  private appliedCoupon: string | null = null;
  private discountPercentage: number = 0;

  async loadCoupons(): Promise<string[]> {
    const response = await api.getCoupons();
    if (response.ok && response.data) {
      return response.data;
    }
    return [];
  }

  async validateCoupon(code: string): Promise<{ valid: boolean; message: string; discount: number }> {
    const response = await api.validateCoupon(code);
    
    if (response.ok && response.data?.valid) {
      this.appliedCoupon = code;
      this.discountPercentage = response.data.discount || 20;
      return {
        valid: true,
        message: `Cupón válido. Se aplicó un ${this.discountPercentage}% de descuento.`,
        discount: this.discountPercentage,
      };
    }

    this.appliedCoupon = null;
    this.discountPercentage = 0;
    return {
      valid: false,
      message: "Cupón inválido.",
      discount: 0,
    };
  }

  aplicarDescuento(total: number): number {
    if (!this.appliedCoupon || this.discountPercentage === 0) {
      return total;
    }
    return total * (1 - this.discountPercentage / 100);
  }

  getAppliedCoupon(): string | null {
    return this.appliedCoupon;
  }

  clearCoupon(): void {
    this.appliedCoupon = null;
    this.discountPercentage = 0;
  }

  async createCoupon(code: string): Promise<{ success: boolean; message: string }> {
    const response = await api.createCoupon(code);
    
    if (response.ok) {
      return { success: true, message: `Cupón "${code}" creado correctamente.` };
    }
    
    return { success: false, message: response.error || "No se pudo crear el cupón." };
  }

  async deleteCoupon(code: string): Promise<{ success: boolean; message: string }> {
    const response = await api.deleteCoupon(code);
    
    if (response.ok) {
      return { success: true, message: `Cupón "${code}" eliminado correctamente.` };
    }
    
    return { success: false, message: response.error || "No se pudo eliminar el cupón." };
  }
}

export const couponService = new CouponService();
export default couponService;

