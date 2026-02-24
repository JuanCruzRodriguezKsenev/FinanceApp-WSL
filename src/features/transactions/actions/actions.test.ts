import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTransaction } from './index';
import { db } from '../../../shared/lib/db';
import { CircuitBreakerFactory } from '../../../shared/lib/circuit-breaker';

// Mock de next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(() => ({ value: 'en' })),
  })),
}));

// Mock de i18n
vi.mock('../../../shared/lib/i18n/getDictionary', () => ({
  getDictionary: vi.fn(async () => ({
    transactions: {
      errorMessage: 'Error message',
    },
  })),
}));

// Mock de DB
vi.mock('../../../shared/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [{ id: '123' }]),
      })),
    })),
  },
}));

// Mock de Circuit Breaker
const { mockExecute } = vi.hoisted(() => ({
  mockExecute: vi.fn((fn) => fn())
}));

vi.mock('../../../shared/lib/circuit-breaker', () => ({
  CircuitBreakerFactory: {
    database: vi.fn(() => ({
      execute: mockExecute,
    })),
  },
  CircuitBreakerOpenError: class extends Error {},
}));

describe('createTransaction Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a transaction successfully with valid input', async () => {
    const input = {
      amount: 100,
      cbu: '0123456789012345678912',
      description: 'Test transfer',
    };

    const result = await createTransaction(input);

    expect(result.isOk).toBe(true);
    if (result.isOk) {
      expect(result.value).toEqual({ id: '123' });
    }
    expect(db.insert).toHaveBeenCalled();
  });

  it('should create a transaction successfully with string amount (coercion)', async () => {
    const input = {
      amount: '500.50',
      cbu: '0123456789012345678912',
    };

    const result = await createTransaction(input);

    expect(result.isOk).toBe(true);
    if (result.isOk) {
      expect(result.value).toEqual({ id: '123' });
    }
  });

  it('should return validation error for invalid input', async () => {
    const input = {
      amount: -10, // Invalid amount
      cbu: 'short',
    };

    const result = await createTransaction(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.type).toBe('VALIDATION_ERROR');
    }
  });

  it('should handle database errors via circuit breaker', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB Down'));

    const input = {
      amount: 100,
      cbu: '0123456789012345678912',
    };

    const result = await createTransaction(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.type).toBe('INTERNAL_ERROR');
      expect(result.error.message).toBe('Error message');
    }
  });
});
