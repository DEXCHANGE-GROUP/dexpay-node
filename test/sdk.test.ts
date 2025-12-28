import { describe, it, expect, vi, beforeEach } from 'vitest';
import DexPay from '../src/index';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('DexPay SDK', () => {
  let client: DexPay;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new DexPay({
      apiKey: 'pk_test_123456789',
      apiSecret: 'sk_test_123456789',
      sandbox: true,
    });
  });

  describe('Initialization', () => {
    it('should create a client instance', () => {
      expect(client).toBeInstanceOf(DexPay);
    });

    it('should throw error without apiKey', () => {
      expect(
        () => new DexPay({ apiKey: '', apiSecret: 'sk_test_123' }),
      ).toThrow('DexPay: apiKey is required');
    });

    it('should throw error without apiSecret', () => {
      expect(
        () => new DexPay({ apiKey: 'pk_test_123', apiSecret: '' }),
      ).toThrow('DexPay: apiSecret is required');
    });

    it('should use sandbox URL when sandbox is true', () => {
      const sandboxClient = new DexPay({
        apiKey: 'pk_test_123',
        apiSecret: 'sk_test_123',
        sandbox: true,
      });
      expect(sandboxClient).toBeDefined();
    });

    it('should use production URL when sandbox is false', () => {
      const prodClient = new DexPay({
        apiKey: 'pk_live_123',
        apiSecret: 'sk_live_123',
        sandbox: false,
      });
      expect(prodClient).toBeDefined();
    });
  });

  describe('Checkout Sessions', () => {
    it('should create a checkout session', async () => {
      const mockResponse = {
        id: 'cs_123',
        reference: 'REF_123',
        amount: 1000,
        currency: 'XOF',
        status: 'PENDING',
        checkout_url: 'https://pay.dexpay.africa/cs_123',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const session = await client.checkoutSessions.create({
        amount: 1000,
        currency: 'XOF',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      expect(session).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/checkout-sessions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'pk_test_123456789',
            'x-api-secret': 'sk_test_123456789',
          }),
        }),
      );
    });

    it('should create a checkout session with client_support_fee', async () => {
      const mockResponse = {
        id: 'cs_124',
        reference: 'REF_124',
        amount: 1000,
        currency: 'XOF',
        status: 'PENDING',
        client_support_fee: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const session = await client.checkoutSessions.create({
        amount: 1000,
        currency: 'XOF',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        client_support_fee: false,
      });

      expect(session.client_support_fee).toBe(false);
    });

    it('should retrieve a checkout session', async () => {
      const mockResponse = {
        id: 'cs_123',
        reference: 'REF_123',
        status: 'COMPLETED',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const session = await client.checkoutSessions.retrieve('cs_123');

      expect(session).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/checkout-sessions/cs_123'),
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });

    it('should list checkout sessions', async () => {
      const mockResponse = {
        data: [{ id: 'cs_1' }, { id: 'cs_2' }],
        hasNextPage: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const sessions = await client.checkoutSessions.list({ limit: 10 });

      expect(sessions.data).toHaveLength(2);
    });
  });

  describe('Payouts', () => {
    it('should create a payout', async () => {
      const mockResponse = {
        id: 'po_123',
        reference: 'PO_20251227_ABC123',
        amount: 5000,
        currency: 'XOF',
        status: 'PENDING',
        recipient_phone: '+221771234567',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const payout = await client.payouts.create({
        amount: 5000,
        currency: 'XOF',
        recipient_phone: '+221771234567',
        recipient_first_name: 'John',
        recipient_last_name: 'Doe',
        payment_provider_code: 'WAVE_SN',
      });

      expect(payout).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/payouts'),
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should retrieve a payout', async () => {
      const mockResponse = {
        id: 'po_123',
        status: 'COMPLETED',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const payout = await client.payouts.retrieve('po_123');

      expect(payout).toEqual(mockResponse);
    });

    it('should list payouts', async () => {
      const mockResponse = {
        data: [{ id: 'po_1' }, { id: 'po_2' }],
        hasNextPage: true,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const payouts = await client.payouts.list();

      expect(payouts.data).toHaveLength(2);
      expect(payouts.hasNextPage).toBe(true);
    });
  });

  describe('Products', () => {
    it('should create a product', async () => {
      const mockResponse = {
        id: 'prod_123',
        name: 'Test Product',
        price: 10000,
        currency: 'XOF',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const product = await client.products.create({
        name: 'Test Product',
        price: 10000,
        currency: 'XOF',
      });

      expect(product).toEqual(mockResponse);
    });

    it('should list products', async () => {
      const mockResponse = {
        data: [{ id: 'prod_1', name: 'Product 1' }],
        hasNextPage: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const products = await client.products.list();

      expect(products.data).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    it('should throw DexPayError on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            message: 'Invalid amount',
            code: 'INVALID_AMOUNT',
          }),
      });

      await expect(
        client.checkoutSessions.create({
          amount: -100,
          currency: 'XOF',
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
        }),
      ).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        client.checkoutSessions.retrieve('cs_123'),
      ).rejects.toThrow();
    });
  });
});
