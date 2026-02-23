import { logger } from "../logger";

export type AppErrorType =
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND_ERROR"
  | "NETWORK_ERROR"
  | "INTERNAL_ERROR";

export interface AppError {
  type: AppErrorType;
  message: string;
  field?: string; // Útil para ValidationErrors (Zod)
  details?: Record<string, any>;
}

export type Ok<T> = {
  isOk: true;
  isErr: false;
  value: T;
};

export type Err<E> = {
  isOk: false;
  isErr: true;
  error: E;
};

// Result Type definition
export type Result<T, E = AppError> = Ok<T> | Err<E>;

// Constructores de Result
export const ok = <T>(value: T): Ok<T> => ({
  isOk: true,
  isErr: false,
  value,
});

export const err = <E>(error: E): Err<E> => ({
  isOk: false,
  isErr: true,
  error,
});

// Helpers para manipular Results de forma segura
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (val: T) => U): Result<U, E> => {
  if (result.isOk) {
    return ok(fn(result.value));
  }
  return result; // Retorna el error original sin modificar
};

export const flatMapResult = <T, U, E>(result: Result<T, E>, fn: (val: T) => Result<U, E>): Result<U, E> => {
  if (result.isOk) {
    return fn(result.value);
  }
  return result; // Retorna el error original sin modificar
};

// Helpers para crear AppErrors más fácilmente
export const validationError = (message: string, field?: string, details?: Record<string, any>): AppError => {
  // Las validaciones de usuario (400) suelen ser warnings o debug
  logger.warn({ type: "VALIDATION_ERROR", field, details }, message);
  return {
    type: "VALIDATION_ERROR",
    message,
    field,
    details,
  };
};

export const databaseError = (message: string, details?: any): AppError => {
  logger.error({ type: "DATABASE_ERROR", details }, message);
  return {
    type: "DATABASE_ERROR",
    message,
    details,
  };
};

export const authorizationError = (message: string = "No autorizado"): AppError => {
  logger.warn({ type: "AUTHORIZATION_ERROR" }, message);
  return {
    type: "AUTHORIZATION_ERROR",
    message,
  };
};

export const notFoundError = (message: string = "Recurso no encontrado"): AppError => {
  logger.info({ type: "NOT_FOUND_ERROR" }, message);
  return {
    type: "NOT_FOUND_ERROR",
    message,
  };
};

export const networkError = (message: string = "Error de red"): AppError => {
  logger.error({ type: "NETWORK_ERROR" }, message);
  return {
    type: "NETWORK_ERROR",
    message,
  };
};

export const internalError = (message: string = "Error interno del servidor", details?: any): AppError => {
  logger.fatal({ type: "INTERNAL_ERROR", details }, message);
  return {
    type: "INTERNAL_ERROR",
    message,
    details,
  };
};
