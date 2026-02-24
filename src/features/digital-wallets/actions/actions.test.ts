import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDigitalWallet } from './index';
import { db } from '../../../shared/lib/db';
import { CircuitBreakerFactory, CircuitBreakerOpenError } from '../../../shared/lib/circuit-breaker';

// Mocks
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => ({ value: 'es' })),
  })),
}));

vi.mock('../../../shared/lib/i18n/getDictionary', () => ({
  getDictionary: vi.fn(async () => ({
    digitalWallets: {
      errorMessage: 'Error',
      apiErrorMessage: 'API Down',
      dbErrorMessage: 'DB Down',
    },
  })),
}));

vi.mock('../../../shared/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [{ id: 'wallet-1', cvu: '123', provider: 'test' }]),
      })),
    })),
  },
}));

const { mockApiExecute, mockDbExecute } = vi.hoisted(() => ({
  mockApiExecute: vi.fn(async (fn) => {
    // Para estabilizar tests, simulamos éxito de la validación externa por defecto
    return { valid: true, owner: "User Name" };
  }),
  mockDbExecute: vi.fn((fn) => fn()),
}));

vi.mock('../../../shared/lib/circuit-breaker', async () => {
  const actual = await vi.importActual('../../../shared/lib/circuit-breaker');
  return {
    ...actual,
    CircuitBreakerFactory: {
      database: vi.fn(() => ({
        execute: mockDbExecute,
      })),
      externalAPI: vi.fn(() => ({
        execute: mockApiExecute,
      })),
    },
  };
});

describe('addDigitalWallet Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a wallet successfully when both breakers are closed', async () => {
    const input = { cvu: '1234567890123456789012', provider: 'MercadoPago' };
    const result = await addDigitalWallet(input);

    expect(result.isOk).toBe(true);
    expect(mockApiExecute).toHaveBeenCalled();
    expect(mockDbExecute).toHaveBeenCalled();
    expect(db.insert).toHaveBeenCalled();
  });

  it('should return error when API breaker is OPEN', async () => {
    mockApiExecute.mockRejectedValueOnce(new CircuitBreakerOpenError('Open'));
    
    const input = { cvu: '1234567890123456789012', provider: 'MercadoPago' };
    const result = await addDigitalWallet(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.message).toBe('API Down');
      expect(result.error.details?.circuitStatus).toBe('OPEN');
    }
  });

  it('should return error when DB breaker is OPEN', async () => {
    mockDbExecute.mockRejectedValueOnce(new CircuitBreakerOpenError('Open'));
    
    const input = { cvu: '1234567890123456789012', provider: 'MercadoPago' };
    const result = await addDigitalWallet(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.message).toBe('DB Down');
      expect(result.error.details?.circuitStatus).toBe('OPEN');
    }
  });
});
