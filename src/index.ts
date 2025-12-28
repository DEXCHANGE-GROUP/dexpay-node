// ================================
// DEXPAY SDK - Main Entry Point
// ================================

import { HttpClient } from './client';
import { CheckoutSessions } from './resources/checkout-sessions';
import { Products } from './resources/products';
import { Customers } from './resources/customers';
import { Subscriptions } from './resources/subscriptions';
import { Payouts } from './resources/payouts';
import { DexPayConfig } from './types';

/**
 * Client SDK DEXPAY pour Node.js / TypeScript
 *
 * @example
 * ```typescript
 * import DexPay from '@dexchangepay/node';
 *
 * const dexpay = new DexPay({
 *   apiKey: 'pk_test_xxx',
 *   apiSecret: 'sk_test_xxx',
 * });
 *
 * // Créer une session de paiement
 * const session = await dexpay.checkoutSessions.create({
 *   reference: 'ORDER_123',
 *   item_name: 'Premium Plan',
 *   amount: 10000,
 *   currency: 'XOF',
 *   success_url: 'https://example.com/success',
 *   failure_url: 'https://example.com/cancel',
 *   webhook_url: 'https://example.com/webhook',
 * });
 *
 * console.log(session.data.payment_url);
 * ```
 */
class DexPay {
  /** Gestion des sessions de paiement */
  public checkoutSessions: CheckoutSessions;
  /** Gestion des produits */
  public products: Products;
  /** Gestion des clients */
  public customers: Customers;
  /** Gestion des abonnements */
  public subscriptions: Subscriptions;
  /** Gestion des payouts (retraits) */
  public payouts: Payouts;

  private client: HttpClient;

  constructor(config: DexPayConfig) {
    if (!config.apiKey) {
      throw new Error('DexPay: apiKey is required');
    }
    if (!config.apiSecret) {
      throw new Error('DexPay: apiSecret is required');
    }

    this.client = new HttpClient(config);
    this.checkoutSessions = new CheckoutSessions(this.client);
    this.products = new Products(this.client);
    this.customers = new Customers(this.client);
    this.subscriptions = new Subscriptions(this.client);
    this.payouts = new Payouts(this.client);
  }
}

// Export default
export default DexPay;

// Named exports
export { DexPay };
export { HttpClient } from './client';
export * from './types';
export * from './resources';
