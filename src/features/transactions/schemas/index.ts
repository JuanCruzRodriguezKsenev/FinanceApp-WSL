import { z } from "../../../shared/lib/validators";

// En vez de tener un schema global con mensajes en español estáticos, 
// lo envolvemos en una función que inyecta las traducciones.
// Pasamos 'any' al dict por simplicidad, pero en producción usarías el tipo derivado de en.json
export const getCreateTransactionSchema = (dict?: any) => {
  // Fallbacks por si el dict no viaja (ej: tests)
  const d = dict || {
    amountRequired: "Amount required",
    amountPositive: "Amount must be positive",
    amountMax: "Amount cannot exceed 1,000,000",
    cbuRequired: "CBU required",
    cbuLength: "CBU must be exactly 22 numbers",
    cbuNumbers: "CBU must only contain numbers",
    descMax: "Description too long"
  };

  return z.object({
    amount: z.coerce
      .number({ message: d.amountRequired })
      .positive(d.amountPositive)
      .max(1000000, d.amountMax),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
    cbu: z
      .string({ message: d.cbuRequired })
      .length(22, d.cbuLength)
      .regex(/^\d+$/, d.cbuNumbers)
      .optional()
      .or(z.literal("")),
    description: z.string().max(255, d.descMax).optional(),
    sourceAccountId: z.string().uuid().optional(),
    contactId: z.string().uuid().optional(),
    destinationAccountId: z.string().uuid().optional(),
  });
};

// Como el tipo de los datos no depende del idioma de los errores,
// podemos inferirlo llamando a la función con el diccionario por defecto
export type CreateTransactionInput = z.infer<ReturnType<typeof getCreateTransactionSchema>>;
