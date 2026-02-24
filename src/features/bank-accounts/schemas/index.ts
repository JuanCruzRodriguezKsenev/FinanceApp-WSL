import { z } from "../../../shared/lib/validators";

export const getAddBankAccountSchema = (dict?: any) => {
  const d = dict || {
    cbuRequired: "CBU required",
    cbuLength: "CBU must be exactly 22 numbers",
    cbuNumbers: "CBU must only contain numbers",
    aliasRequired: "Alias is required",
    aliasMin: "Alias must be at least 3 characters",
    aliasMax: "Alias cannot exceed 50 characters",
    bankNameRequired: "Bank name is required"
  };

  return z.object({
    cbu: z.string({ message: d.cbuRequired }).length(22, d.cbuLength).regex(/^\d+$/, d.cbuNumbers),
    alias: z.string({ message: d.aliasRequired }).min(3, d.aliasMin).max(50),
    bankName: z.string({ message: d.bankRequired }).min(2, d.bankMin).max(100),
    balance: z.coerce.number().default(0),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
  });
};


export type AddBankAccountInput = z.infer<ReturnType<typeof getAddBankAccountSchema>>;
