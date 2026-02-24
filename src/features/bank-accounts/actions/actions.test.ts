import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addBankAccount } from './index';
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
    bankAccounts: {
      errorMessage: 'Error',
      uniqueCbuError: 'CBU Duplicate',
    },
  })),
}));

vi.mock('../../../shared/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(async () => [{ id: 'ba-1', cbu: '0123456789012345678912', alias: 'test', bankName: 'test bank' }]),
      })),
    })),
  },
}));

const { mockDbExecute } = vi.hoisted(() => ({
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
    },
  };
});

describe('addBankAccount Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a bank account successfully', async () => {
    const input = { 
      cbu: '0123456789012345678912', 
      alias: 'mi-cuenta', 
      bankName: 'Banco Galacia' 
    };
    const result = await addBankAccount(input);

    expect(result.isOk).toBe(true);
    expect(mockDbExecute).toHaveBeenCalled();
    expect(db.insert).toHaveBeenCalled();
  });

  it('should return error when CBU is duplicate', async () => {
    const dbError = new Error('duplicate key value violates unique constraint');
    (dbError as any).code = '23505';
    mockDbExecute.mockRejectedValueOnce(dbError);
    
    const input = { 
      cbu: '0123456789012345678912', 
      alias: 'mi-cuenta', 
      bankName: 'Banco Galacia' 
    };
    const result = await addBankAccount(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.message).toBe('CBU Duplicate');
    }
  });

  it('should return error when database breaker is OPEN', async () => {
    mockDbExecute.mockRejectedValueOnce(new CircuitBreakerOpenError('Open'));
    
    const input = { 
      cbu: '0123456789012345678912', 
      alias: 'mi-cuenta', 
      bankName: 'Banco Galacia' 
    };
    const result = await addBankAccount(input);

    expect(result.isOk).toBe(false);
    if (!result.isOk) {
      expect(result.error.details?.circuitStatus).toBe('OPEN');
    }
  });
});
