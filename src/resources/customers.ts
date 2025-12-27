// ================================
// DEXPAY SDK - Customers
// ================================

import { HttpClient } from '../client';
import {
  CreateCustomerParams,
  UpdateCustomerParams,
  Customer,
  ApiResponse,
  PaginatedResponse,
  ListParams,
} from '../types';

export interface ListCustomersParams extends ListParams {
  email?: string;
  phone?: string;
}

export class Customers {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Créer un nouveau client
   *
   * @example
   * ```typescript
   * const customer = await dexpay.customers.create({
   *   name: 'Jean Dupont',
   *   email: 'jean@example.com',
   *   phone: '+221771234567',
   *   country: 'SN',
   * });
   * ```
   */
  async create(params: CreateCustomerParams): Promise<ApiResponse<Customer>> {
    return this.client.post<ApiResponse<Customer>>('/customers', params);
  }

  /**
   * Récupérer un client par son ID
   */
  async retrieve(id: string): Promise<ApiResponse<Customer>> {
    return this.client.get<ApiResponse<Customer>>(`/customers/${id}`);
  }

  /**
   * Lister tous les clients avec pagination et filtres
   */
  async list(
    params?: ListCustomersParams,
  ): Promise<PaginatedResponse<Customer>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.email) query.set('email', params.email);
    if (params?.phone) query.set('phone', params.phone);

    const queryString = query.toString();
    const path = `/customers${queryString ? `?${queryString}` : ''}`;

    return this.client.get<PaginatedResponse<Customer>>(path);
  }

  /**
   * Mettre à jour un client
   */
  async update(
    id: string,
    params: UpdateCustomerParams,
  ): Promise<ApiResponse<Customer>> {
    return this.client.patch<ApiResponse<Customer>>(`/customers/${id}`, params);
  }

  /**
   * Supprimer un client (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(
      `/customers/${id}`,
    );
  }
}
