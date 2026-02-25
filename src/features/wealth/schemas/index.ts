import { z } from "../../../shared/lib/validators";

export const getAssetSchema = (dict?: any) => {
  const d = dict || {};
  return z.object({
    name: z.string().min(2, d.nameMin || "Name too short"),
    type: z.enum(['REAL_ESTATE', 'STOCKS', 'CASH', 'CRYPTO', 'OTHER']),
    value: z.coerce.number().min(0, d.valueMin || "Value must be positive"),
    currency: z.enum(['ARS', 'USD']).default('USD'),
    tickerSymbol: z.string().optional(),
  });
};

export const getLiabilitySchema = (dict?: any) => {
  const d = dict || {};
  return z.object({
    name: z.string().min(2, d.nameMin || "Name too short"),
    type: z.enum(['PERSONAL_LOAN', 'MORTGAGE', 'OTHER']),
    amount: z.coerce.number().min(0, d.amountMin || "Amount must be positive"),
    currency: z.enum(['ARS', 'USD']).default('ARS'),
  });
};

export const getCreditCardSchema = (dict?: any) => {
  const d = dict || {};
  return z.object({
    name: z.string().min(2, d.nameMin || "Name too short"),
    bankName: z.string().min(2, d.bankMin || "Bank name too short"),
    limit: z.coerce.number().min(0),
    currency: z.enum(['ARS', 'USD']).default('ARS'),
    closingDay: z.coerce.number().min(1).max(31).optional().nullable(),
    dueDay: z.coerce.number().min(1).max(31).optional().nullable(),
    autoDebit: z.coerce.boolean().default(false),
    currentBalance: z.coerce.number().default(0),
  });
};

export type AssetInput = z.infer<ReturnType<typeof getAssetSchema>>;
export type LiabilityInput = z.infer<ReturnType<typeof getLiabilitySchema>>;
export type CreditCardInput = z.infer<ReturnType<typeof getCreditCardSchema>>;
