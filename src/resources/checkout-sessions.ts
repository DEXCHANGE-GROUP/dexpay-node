// ================================
// DEXPAY SDK - Checkout Sessions
// ================================

import { HttpClient } from '../client';
import {
  CreateCheckoutSessionParams,
  CheckoutSession,
  CreatePaymentAttemptParams,
  PaymentAttempt,
  ApiResponse,
  PaginatedResponse,
  ListParams,
} from '../types';

export class CheckoutSessions {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Créer une nouvelle session de paiement
   *
   * @example
   * ```typescript
   * const session = await dexpay.checkoutSessions.create({
   *   reference: 'ORDER_123',
   *   item_name: 'Premium Plan',
   *   amount: 10000,
   *   currency: 'XOF',
   *   success_url: 'https://example.com/success',
   *   failure_url: 'https://example.com/cancel',
   *   webhook_url: 'https://example.com/webhook',
   * });
   * ```
   */
  async create(
    params: CreateCheckoutSessionParams,
  ): Promise<ApiResponse<CheckoutSession>> {
    return this.client.post<ApiResponse<CheckoutSession>>(
      '/checkout-sessions',
      params,
    );
  }

  /**
   * Récupérer une session par son ID
   */
  async retrieve(id: string): Promise<CheckoutSession> {
    return this.client.get<CheckoutSession>(`/checkout-sessions/${id}`);
  }

  /**
   * Récupérer une session par sa référence
   */
  async retrieveByReference(reference: string): Promise<CheckoutSession> {
    return this.client.get<CheckoutSession>(
      `/checkout-sessions/reference/${reference}`,
    );
  }

  /**
   * Lister toutes les sessions avec pagination
   */
  async list(params?: ListParams): Promise<PaginatedResponse<CheckoutSession>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const queryString = query.toString();
    const path = `/checkout-sessions${queryString ? `?${queryString}` : ''}`;

    return this.client.get<PaginatedResponse<CheckoutSession>>(path);
  }

  /**
   * Créer une tentative de paiement pour une session
   *
   * @example
   * ```typescript
   * const attempt = await dexpay.checkoutSessions.createPaymentAttempt(
   *   'ORDER_123',
   *   {
   *     payment_method: 'MOBILE_MONEY',
   *     operator: 'wave',
   *     countryISO: 'SN',
   *     customer: {
   *       name: 'Jean Dupont',
   *       phone: '+221771234567',
   *       email: 'jean@example.com',
   *     },
   *   },
   * );
   * ```
   */
  async createPaymentAttempt(
    reference: string,
    params: CreatePaymentAttemptParams,
  ): Promise<ApiResponse<PaymentAttempt>> {
    return this.client.post<ApiResponse<PaymentAttempt>>(
      `/checkout-sessions/${reference}/transaction-attempt`,
      params,
    );
  }

  /**
   * Annuler une session (soft delete)
   */
  async cancel(id: string): Promise<void> {
    await this.client.delete(`/checkout-sessions/${id}`);
  }
}
