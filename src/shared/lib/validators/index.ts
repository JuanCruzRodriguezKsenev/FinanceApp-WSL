import { z } from "zod";
import { Result, ok, err, validationError } from "../result";
import { cookies } from "next/headers";

/**
 * Función genérica para validar un objeto contra un esquema de Zod.
 * @param data - Los datos a validar
 * @param schema - El esquema Zod contra el cual validar
 * @returns Un Result que contiene los datos validados tipados, o un AppError
 */
export async function validateSchema<T>(data: unknown, schema: z.ZodSchema<T>): Promise<Result<T>> {
  // Simulamos carga asíncrona para que en el futuro se puedan leer headers/cookies si es necesario para i18n
  await Promise.resolve();
  
  const result = schema.safeParse(data);

  if (result.success) {
    return ok(result.data);
  }

  const zodError = result.error;
  const issues = zodError.issues;
  const firstError = issues && issues.length > 0 ? issues[0] : null;
  const fieldPath = firstError?.path.join(".");
  
  const errorMessage = firstError?.message || "Error de validación";

  return err(
    validationError(errorMessage, fieldPath, {
      zodErrors: zodError.format(),
    })
  );
}

// Re-exportamos zod para comodidad
export { z };
