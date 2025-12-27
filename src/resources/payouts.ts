// ================================
// DEXPAY SDK - Payouts
// ================================

import { HttpClient } from '../client';
import {
  ApiResponse,
  PaginatedResponse,
  ListParams,
  Currency,
  TransactionStatus,
} from '../types';

// ========== Payout Types ==========

export interface PayoutDestinationDetails {
  /** Opérateur mobile money (wave, orange_money, mtn, moov) */
  operator: string;
  /** Code pays ISO (SN, CI, ML, etc.) */
  countryISO: string;
  /** Nom du destinataire (optionnel) */
  recipient_name?: string;
}

export interface CreatePayoutParams {
  /** Montant du payout */
  amount: number;
  /** Devise (XOF, XAF, GNF) */
  currency: Currency | string;
  /** Numéro de téléphone du destinataire */
  destination_phone: string;
  /** Détails de destination */
  destination_details: PayoutDestinationDetails;
  /** Métadonnées additionnelles */
  metadata?: Record<string, any>;
}

export interface Payout {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  fees: number;
  total_amount: number;
  status: TransactionStatus;
  destination_phone: string;
  destination_details: PayoutDestinationDetails;
  metadata?: Record<string, any>;
  failure_reason?: string;
  completed_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListPayoutsParams extends ListParams {
  status?: TransactionStatus | string;
}

export class Payouts {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Créer un nouveau payout (retrait)
   *
   * @example
   * ```typescript
   * const payout = await dexpay.payouts.create({
   *   amount: 10000,
   *   currency: 'XOF',
   *   destination_phone: '+221771234567',
   *   destination_details: {
   *     operator: 'wave',
   *     countryISO: 'SN',
   *     recipient_name: 'Jean Dupont',
   *   },
   * });
   * ```
   */
  async create(params: CreatePayoutParams): Promise<Payout> {
    return this.client.post<Payout>('/payouts', params);
  }

  /**
   * Récupérer un payout par son ID
   */
  async retrieve(id: string): Promise<Payout> {
    return this.client.get<Payout>(`/payouts/${id}`);
  }

  /**
   * Lister tous les payouts avec pagination
   */
  async list(params?: ListPayoutsParams): Promise<PaginatedResponse<Payout>> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);

    const queryString = query.toString();
    const path = `/payouts${queryString ? `?${queryString}` : ''}`;

    return this.client.get<PaginatedResponse<Payout>>(path);
  }

  /**
   * Annuler un payout (uniquement si statut PENDING)
   *
   * @example
   * ```typescript
   * const cancelled = await dexpay.payouts.cancel('payout_123', 'Demande client');
   * ```
   */
  async cancel(id: string, reason?: string): Promise<Payout> {
    return this.client.post<Payout>(`/payouts/${id}/cancel`, { reason });
  }
}
