// ================================
// DEXPAY SDK - Subscriptions
// ================================

import { HttpClient } from '../client';
import {
  CreateSubscriptionParams,
  Subscription,
  SubscriptionStatus,
  ApiResponse,
  PaginatedResponse,
  ListParams,
} from '../types';

export interface ListSubscriptionsParams extends ListParams {
  status?: SubscriptionStatus | string;
  customer_id?: string;
  product_id?: string;
}

export class Subscriptions {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Créer un nouvel abonnement
   *
   * @example
   * ```typescript
   * const subscription = await dexpay.subscriptions.create({
   *   customer_id: 'cus_123',
   *   product_id: 'prod_456',
   * });
   * ```
   */
  async create(
    params: CreateSubscriptionParams,
  ): Promise<ApiResponse<Subscription>> {
    return this.client.post<ApiResponse<Subscription>>(
      '/subscriptions',
      params,
    );
  }

  /**
   * Récupérer un abonnement par son ID
   */
  async retrieve(id: string): Promise<ApiResponse<Subscription>> {
    return this.client.get<ApiResponse<Subscription>>(`/subscriptions/${id}`);
  }

  /**
   * Lister tous les abonnements avec pagination et filtres
   */
  async list(
    params?: ListSubscriptionsParams,
  ): Promise<PaginatedResponse<Subscription>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.customer_id) query.set('customer_id', params.customer_id);
    if (params?.product_id) query.set('product_id', params.product_id);

    const queryString = query.toString();
    const path = `/subscriptions${queryString ? `?${queryString}` : ''}`;

    return this.client.get<PaginatedResponse<Subscription>>(path);
  }

  /**
   * Annuler un abonnement
   */
  async cancel(id: string): Promise<ApiResponse<Subscription>> {
    return this.client.post<ApiResponse<Subscription>>(
      `/subscriptions/${id}/cancel`,
      {},
    );
  }

  /**
   * Supprimer un abonnement (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(
      `/subscriptions/${id}`,
    );
  }
}
