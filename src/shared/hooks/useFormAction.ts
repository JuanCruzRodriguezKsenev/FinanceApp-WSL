"use client";

import { useActionState, useEffect } from "react";
import { AppError, Result } from "../lib/result";

/**
 * Options for the useFormAction hook.
 */
interface UseFormActionOptions<T, E> {
  /** Callback triggered when the action succeeds */
  onSuccess?: (data: T) => void;
  /** Callback triggered when the action fails */
  onError?: (error: E) => void;
}

/**
 * React 19 optimized hook that integrates `useActionState` with the Result Pattern.
 * Ideal for forms that use Server Actions directly via the `action` attribute.
 * 
 * @template Input - The type of the input expected by the action
 * @template Output - The type of the successful result
 * @template Err - The type of the error result (defaults to AppError)
 * 
 * @param action - The Server Action to invoke
 * @param options - Optional onSuccess and onError callbacks
 * @returns An object containing the formAction to pass to <form>, current state and pending status
 */
export function useFormAction<Input, Output, Err = AppError>(
  action: (input: Input) => Promise<Result<Output, Err>>,
  options?: UseFormActionOptions<Output, Err>
) {
  // Estado inicial: un Result "vacío" o null
  const [state, formAction, isPending] = useActionState(
    async (prevState: Result<Output, Err> | null, formData: FormData) => {
      // Convertir FormData a objeto plano (Input)
      // Nota: Aquí asumimos que las claves de FormData coinciden con Input
      const rawData = Object.fromEntries(formData.entries());
      
      // Intentamos ejecutar la acción
      // Nota: Si el Input requiere tipos específicos (ej. números), 
      // la validación Zod en la acción se encargará o fallará.
      // Para mayor robustez, se recomienda pre-procesar si es necesario.
      return await action(rawData as unknown as Input);
    },
    null
  );

  useEffect(() => {
    if (!state) return;

    if (state.isOk) {
      options?.onSuccess?.(state.value);
    } else {
      options?.onError?.(state.error);
    }
  }, [state, options]);

  return {
    state,
    formAction,
    isPending,
  };
}
