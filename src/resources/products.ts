// ================================
// DEXPAY SDK - Products
// ================================

import { HttpClient } from '../client';
import {
  CreateProductParams,
  UpdateProductParams,
  Product,
  ApiResponse,
  PaginatedResponse,
  ListParams,
  ProductType,
} from '../types';

export interface ListProductsParams extends ListParams {
  type?: ProductType | string;
  is_active?: boolean;
}

export class Products {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Créer un nouveau produit
   *
   * @example
   * ```typescript
   * const product = await dexpay.products.create({
   *   name: 'Premium Plan',
   *   price: 10000,
   *   currency: 'XOF',
   *   type: 'RECURRING',
   *   billing_period: 'MONTHLY',
   * });
   * ```
   */
  async create(params: CreateProductParams): Promise<ApiResponse<Product>> {
    return this.client.post<ApiResponse<Product>>('/products', params);
  }

  /**
   * Récupérer un produit par son ID
   */
  async retrieve(id: string): Promise<ApiResponse<Product>> {
    return this.client.get<ApiResponse<Product>>(`/products/${id}`);
  }

  /**
   * Lister tous les produits avec pagination et filtres
   */
  async list(params?: ListProductsParams): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.type) query.set('type', params.type);
    if (params?.is_active !== undefined)
      query.set('is_active', String(params.is_active));

    const queryString = query.toString();
    const path = `/products${queryString ? `?${queryString}` : ''}`;

    return this.client.get<PaginatedResponse<Product>>(path);
  }

  /**
   * Mettre à jour un produit
   */
  async update(
    id: string,
    params: UpdateProductParams,
  ): Promise<ApiResponse<Product>> {
    return this.client.patch<ApiResponse<Product>>(`/products/${id}`, params);
  }

  /**
   * Supprimer un produit (soft delete)
   */
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.client.delete<ApiResponse<{ message: string }>>(
      `/products/${id}`,
    );
  }
}
