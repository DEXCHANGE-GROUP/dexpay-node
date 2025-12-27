// ================================
// DEXPAY SDK - Types
// ================================

export interface DexPayConfig {
  /** Clé API publique (pk_test_xxx ou pk_live_xxx) */
  apiKey: string;
  /** Clé API secrète (sk_test_xxx ou sk_live_xxx) */
  apiSecret: string;
  /** URL de base de l'API (optionnel) */
  baseUrl?: string;
  /** Timeout en ms (défaut: 30000) */
  timeout?: number;
}

// ========== Enums ==========

export enum Currency {
  XOF = 'XOF',
  XAF = 'XAF',
  GNF = 'GNF',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum ProductType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
}

export enum BillingPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

// ========== Checkout Sessions ==========

export interface CreateCheckoutSessionParams {
  /** Référence unique de la commande */
  reference: string;
  /** Nom de l'article/service */
  item_name: string;
  /** Montant en centimes */
  amount: number;
  /** Devise (XOF, XAF, GNF) */
  currency: Currency | string;
  /** URL de redirection en cas de succès */
  success_url: string;
  /** URL de redirection en cas d'échec */
  failure_url: string;
  /** URL de webhook pour les notifications */
  webhook_url: string;
  /** Métadonnées additionnelles */
  metadata?: Record<string, any>;
  /** Date d'expiration */
  expires_at?: string;
}

export interface CheckoutSession {
  reference: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_url: string;
  success_url: string;
  failure_url: string;
  webhook_url: string;
  expires_at: string | null;
  isSandbox: boolean;
  payment_attempt?: PaymentAttempt;
  sandbox_payment_url?: string;
}

export interface PaymentAttempt {
  id: string;
  status: TransactionStatus;
  payment_url: string;
  operator: string;
}

export interface CreatePaymentAttemptParams {
  /** Méthode de paiement */
  payment_method: PaymentMethod | string;
  /** Opérateur (wave, orange_money, mtn, moov) */
  operator: string;
  /** Code pays ISO (SN, CI, ML, etc.) */
  countryISO: string;
  /** Informations client */
  customer: {
    name: string;
    phone: string;
    email: string;
  };
}

// ========== Products ==========

export interface CreateProductParams {
  /** Nom du produit */
  name: string;
  /** Description */
  description?: string;
  /** Prix */
  price: number;
  /** Devise */
  currency: Currency | string;
  /** Type de produit */
  type: ProductType | string;
  /** Période de facturation (pour RECURRING) */
  billing_period?: BillingPeriod | string;
  /** Actif ou non */
  is_active?: boolean;
  /** URL de l'image */
  image_url?: string;
  /** Métadonnées */
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  type: ProductType;
  billing_period?: BillingPeriod;
  is_active: boolean;
  image_url?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductParams extends Partial<CreateProductParams> {}

// ========== Customers ==========

export interface CreateCustomerParams {
  /** Nom complet */
  name: string;
  /** Email */
  email: string;
  /** Téléphone */
  phone: string;
  /** Pays */
  country?: string;
  /** Métadonnées */
  metadata?: Record<string, any>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  total_spent: number;
  total_orders: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerParams extends Partial<CreateCustomerParams> {}

// ========== Subscriptions ==========

export interface CreateSubscriptionParams {
  /** ID du client */
  customer_id: string;
  /** ID du produit */
  product_id: string;
  /** Métadonnées */
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  customer_id: string;
  product_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  next_billing_date: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ========== API Response ==========

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}

export interface ListParams {
  page?: number;
  limit?: number;
}

// ========== Errors ==========

export class DexPayError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'DexPayError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
