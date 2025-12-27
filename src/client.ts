// ================================
// DEXPAY SDK - HTTP Client
// ================================

import { DexPayConfig, DexPayError, ApiResponse } from './types';

const DEFAULT_BASE_URL = 'https://api-dpay.dexchange.sn/api/v1';
const DEFAULT_TIMEOUT = 30000;

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private timeout: number;

  constructor(config: DexPayConfig) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'x-api-secret': this.apiSecret,
    };
  }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        throw new DexPayError(
          (data.message as string) ||
            (data.error as string) ||
            'An error occurred',
          response.status,
          (data.code as string) || 'UNKNOWN_ERROR',
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DexPayError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new DexPayError('Request timeout', 408, 'TIMEOUT');
        }
        throw new DexPayError(error.message, 500, 'NETWORK_ERROR');
      }

      throw new DexPayError('Unknown error', 500, 'UNKNOWN_ERROR');
    }
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}
