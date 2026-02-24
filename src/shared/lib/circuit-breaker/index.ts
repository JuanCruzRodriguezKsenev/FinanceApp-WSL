import { Redis } from "@upstash/redis";
import { logger } from "../logger";

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  failureThreshold: number; // Número de fallos antes de abrir el circuito
  resetTimeoutMs: number; // Tiempo en ms antes de pasar a HALF_OPEN
}

type CBData = {
  state: CircuitBreakerState;
  failureCount: number;
  nextAttempt: number;
};

// Singleton para la conexión de Redis, falla silenciosamente si no hay credenciales
let redisClient: Redis | null = null;

export function initializeRedisClient() {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    } catch (error) {
      console.warn(
        "Could not initialize Upstash Redis client. Falling back to memory.",
      );
    }
  } else {
    redisClient = null;
  }
}

// Inicializamos al cargar el módulo
initializeRedisClient();

/**
 * Error lanzado cuando el Circuit Breaker está en estado OPEN.
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

/**
 * Un Circuit Breaker Distribuido que utiliza Upstash Redis para persistir el estado.
 * Implementa una arquitectura "Fast-Fail" para proteger servicios degradados.
 */
export class CircuitBreaker {
  private memData: CBData = { state: "CLOSED", failureCount: 0, nextAttempt: 0 };

  constructor(
    public readonly name: string,
    private readonly options: CircuitBreakerOptions
  ) {}

  /**
   * Obtiene el estado actual del circuito desde Redis o memoria local.
   */
  private async getData(): Promise<CBData> {
    if (redisClient) {
      try {
        const data = await redisClient.get<CBData>(`cb:${this.name}`);
        return data || { state: "CLOSED", failureCount: 0, nextAttempt: 0 };
      } catch (err) {
        return this.memData;
      }
    }
    return this.memData;
  }

  /**
   * Persiste el estado del circuito y registra transiciones en los logs.
   */
  private async setData(data: CBData): Promise<void> {
    const oldData = await this.getData();
    if (oldData.state !== data.state) {
      logger.info(
        { breaker: this.name, from: oldData.state, to: data.state },
        `Circuit Breaker state transition: ${oldData.state} -> ${data.state}`
      );
    }

    if (redisClient) {
      try {
        await redisClient.set(`cb:${this.name}`, data);
      } catch (err) {
        this.memData = data;
      }
    } else {
      this.memData = data;
    }
  }

  /**
   * Envuelve una acción asíncrona con la protección del Circuit Breaker.
   * @throws {CircuitBreakerOpenError} Si el circuito está abierto.
   */
  public async execute<T>(action: () => Promise<T>): Promise<T> {
    const data = await this.getData();

    if (data.state === "OPEN") {
      if (Date.now() >= data.nextAttempt) {
        data.state = "HALF_OPEN";
        await this.setData(data);
      } else {
        throw new CircuitBreakerOpenError(
          `Circuit breaker '${this.name}' is OPEN.`
        );
      }
    }

    try {
      const result = await action();
      if (data.state === "HALF_OPEN" || data.failureCount > 0) {
        await this.onSuccess();
      }
      return result;
    } catch (error) {
      await this.onFailure(data);
      throw error;
    }
  }

  private async onSuccess() {
    await this.setData({ state: "CLOSED", failureCount: 0, nextAttempt: 0 });
  }

  private async onFailure(currentData: CBData) {
    let { failureCount, state, nextAttempt } = currentData;
    
    if (state === "HALF_OPEN") {
      failureCount = this.options.failureThreshold;
      state = "OPEN";
      nextAttempt = Date.now() + this.options.resetTimeoutMs;
    } else {
      failureCount++;
      if (failureCount >= this.options.failureThreshold) {
        state = "OPEN";
        nextAttempt = Date.now() + this.options.resetTimeoutMs;
      }
    }
    
    await this.setData({ state, failureCount, nextAttempt });
  }

  /**
   * Retorna el estado lógico del circuito.
   */
  public async getState(): Promise<CircuitBreakerState> {
    const data = await this.getData();
    if (data.state === "OPEN" && Date.now() >= data.nextAttempt) {
      return "HALF_OPEN";
    }
    return data.state;
  }
  
  /**
   * Reinicia manualmente el estado del circuito.
   */
  public async clearState(): Promise<void> {
      await this.setData({ state: "CLOSED", failureCount: 0, nextAttempt: 0 });
  }
}

/**
 * Factory para obtener instancias de Circuit Breakers por dominio.
 */
export class CircuitBreakerFactory {
  private static breakers: Map<string, CircuitBreaker> = new Map();

  static database(name: string): CircuitBreaker {
    return this.getOrCreate(`db:${name}`, { failureThreshold: 5, resetTimeoutMs: 30000 });
  }

  static externalAPI(name: string): CircuitBreaker {
    return this.getOrCreate(`api:${name}`, { failureThreshold: 10, resetTimeoutMs: 60000 });
  }

  private static getOrCreate(name: string, options: CircuitBreakerOptions): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, options));
    }
    return this.breakers.get(name)!;
  }
}
