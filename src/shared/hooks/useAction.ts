"use client";

import { useState } from "react";
import { AppError, Result } from "../lib/result";

/**
 * Options for the useAction hook.
 */
interface UseActionOptions<T, E> {
  /** Callback triggered when the action succeeds */
  onSuccess?: (data: T) => void;
  /** Callback triggered when the action fails */
  onError?: (error: E) => void;
}

/**
 * Generic hook to execute Server Actions that return `Result<Output, AppError>`.
 * Manages "loading", "error", and "data" states automatically.
 * 
 * @template Input - The type of the input expected by the action
 * @template Output - The type of the successful result
 * @template Err - The type of the error result (defaults to AppError)
 * 
 * @param action - The Server Action to invoke
 * @param options - Optional onSuccess and onError callbacks
 * @returns An object containing the execution function and state
 */
export function useAction<Input, Output, Err = AppError>(
  action: (input: Input) => Promise<Result<Output, Err>>,
  options?: UseActionOptions<Output, Err>
) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [data, setData] = useState<Output | null>(null);
  const [error, setError] = useState<Err | null>(null);

  const execute = async (input: Input) => {
    setIsExecuting(true);
    setError(null);
    setData(null);

    try {
      const result = await action(input);

      if (result.isOk) {
        setData(result.value);
        options?.onSuccess?.(result.value);
      } else {
        setError(result.error);
        options?.onError?.(result.error);
      }
    } catch (err) {
      // Manejamos un fallo catastrófico (ej. Red caída, 500 Interno de Next.js)
      // Lo envolvemos en una interfaz parecida a AppError para mantener consistencia
      const fallbackError = {
        type: "NETWORK_ERROR",
        message: err instanceof Error ? err.message : "Error inesperado de conexión",
      } as unknown as Err;
      
      setError(fallbackError);
      options?.onError?.(fallbackError);
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    execute,
    isExecuting,
    data,
    error,
    reset: () => {
      setData(null);
      setError(null);
      setIsExecuting(false);
    }
  };
}
