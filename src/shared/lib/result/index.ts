import { logger } from "../logger";

/**
 * Tipos de error soportados por la aplicación.
 */
export type AppErrorType =
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND_ERROR"
  | "NETWORK_ERROR"
  | "INTERNAL_ERROR";

/**
 * Estructura de error estandarizada para el Result Pattern.
 */
export interface AppError {
  type: AppErrorType;
  message: string;
  field?: string; // Útil para ValidationErrors (Zod)
  details?: Record<string, any>;
}

/**
 * Representa un resultado exitoso.
 */
export type Ok<T> = {
  isOk: true;
  isErr: false;
  value: T;
};

/**
 * Representa un resultado fallido.
 */
export type Err<E> = {
  isOk: false;
  isErr: true;
  error: E;
};

/**
 * Tipo Result inspirado en programación funcional (Rust/Haskell).
 * Garantiza la serialización RSC al ser un POJO plano.
 */
export type Result<T, E = AppError> = Ok<T> | Err<E>;

/**
 * Crea un objeto de éxito.
 * @param value Valor a retornar.
 */
export const ok = <T>(value: T): Ok<T> => ({
  isOk: true,
  isErr: false,
  value,
});

/**
 * Crea un objeto de error.
 * @param error Objeto de error.
 */
export const err = <E>(error: E): Err<E> => ({
  isOk: false,
  isErr: true,
  error,
});

/**
 * Mapea el valor de un Result exitoso a un nuevo valor.
 * Si el Result es un error, lo retorna sin cambios.
 */
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> => {
  if (result.isOk) {
    return ok(fn(result.value));
  }
  return result; 
};

/**
 * Mapea el valor de un Result exitoso a un nuevo Result.
 * Útil para encadenar operaciones que pueden fallar.
 */
export const flatMapResult = <T, U, E>(result: Result<T, E>, fn: (val: T) => Result<U, E>): Result<U, E> => {
  if (result.isOk) {
    return fn(result.value);
  }
  return result;
};

/**
 * Crea un AppError de validación (400).
 */
export const validationError = (message: string, field?: string, details?: Record<string, any>): AppError => {
  logger.warn({ type: "VALIDATION_ERROR", field, details }, message);
  return {
    type: "VALIDATION_ERROR",
    message,
    field,
    details,
  };
};

/**
 * Crea un AppError de base de datos (500).
 */
export const databaseError = (message: string, details?: any): AppError => {
  logger.error({ type: "DATABASE_ERROR", details }, message);
  return {
    type: "DATABASE_ERROR",
    message,
    details,
  };
};

/**
 * Crea un AppError de autorización (401/403).
 */
export const authorizationError = (message: string = "No autorizado"): AppError => {
  logger.warn({ type: "AUTHORIZATION_ERROR" }, message);
  return {
    type: "AUTHORIZATION_ERROR",
    message,
  };
};

/**
 * Crea un AppError de recurso no encontrado (404).
 */
export const notFoundError = (message: string = "Recurso no encontrado"): AppError => {
  logger.info({ type: "NOT_FOUND_ERROR" }, message);
  return {
    type: "NOT_FOUND_ERROR",
    message,
  };
};

/**
 * Crea un AppError de red/servicio externo (503).
 */
export const networkError = (message: string = "Error de red"): AppError => {
  logger.error({ type: "NETWORK_ERROR" }, message);
  return {
    type: "NETWORK_ERROR",
    message,
  };
};

/**
 * Crea un AppError interno genérico (500).
 */
export const internalError = (message: string = "Error interno del servidor", details?: any): AppError => {
  logger.fatal({ type: "INTERNAL_ERROR", details }, message);
  return {
    type: "INTERNAL_ERROR",
    message,
    details,
  };
};
