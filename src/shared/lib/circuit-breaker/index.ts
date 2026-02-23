import { Redis } from "@upstash/redis";

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  failureThreshold: number; // Número de fallos antes de abrir el circuito
  resetTimeoutMs: number; // Tiempo en ms antes de pasar a HALF_OPEN
}

export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

type CBData = {
  state: CircuitBreakerState;
  failureCount: number;
  nextAttempt: number;
};

// Singleton para la conexión de Redis, falla silenciosamente si no hay credenciales
let redisClient: Redis | null = null;

export function initializeRedisClient() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
    } catch (error) {
      console.warn("Could not initialize Upstash Redis client. Falling back to memory.");
    }
  } else {
     redisClient = null;
  }
}

// Inicializamos al cargar el módulo
initializeRedisClient();

/**
 * Un Circuit Breaker Distribuido.
 * Si Redis está configurado usa Upstash Redis para compartir estado entre instancias Vercel.
 * De lo contrario, hace fallback a memoria RAM.
 */
export class CircuitBreaker {
  private memData: CBData = { state: "CLOSED", failureCount: 0, nextAttempt: 0 };

  constructor(
    public readonly name: string,
    private readonly options: CircuitBreakerOptions
  ) {}

  private async getData(): Promise<CBData> {
    if (redisClient) {
      try {
        const data = await redisClient.get<CBData>(`cb:${this.name}`);
        return data || { state: "CLOSED", failureCount: 0, nextAttempt: 0 };
      } catch (err) {
        // En caso de fallo de red a Redis, fallback a memoria
        return this.memData;
      }
    }
    return this.memData;
  }

  private async setData(data: CBData): Promise<void> {
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

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    const data = await this.getData();

    if (data.state === "OPEN") {
      if (Date.now() >= data.nextAttempt) {
        // El timeout ha expirado, pasamos a HALF_OPEN para probar
        data.state = "HALF_OPEN";
        await this.setData(data);
      } else {
        // Seguimos en OPEN, rechazamos de inmediato ("fast fail")
        throw new CircuitBreakerOpenError(
          `Circuit breaker '${this.name}' is OPEN.`
        );
      }
    }

    try {
      const result = await action();
      // Si la llamada tiene éxito, reiniciamos el circuito
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
    failureCount++;
    if (failureCount >= this.options.failureThreshold) {
      state = "OPEN";
      nextAttempt = Date.now() + this.options.resetTimeoutMs;
    }
    await this.setData({ state, failureCount, nextAttempt });
  }

  public async getState(): Promise<CircuitBreakerState> {
    const data = await this.getData();
    if (data.state === "OPEN" && Date.now() >= data.nextAttempt) {
      return "HALF_OPEN";
    }
    return data.state;
  }
  
  // Method to reset state mainly for testing purposes
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
