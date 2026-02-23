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
    cbu: z
      .string({ message: d.cbuRequired })
      .length(22, d.cbuLength)
      .regex(/^\d+$/, d.cbuNumbers),
    alias: z
      .string({ message: d.aliasRequired })
      .min(3, d.aliasMin)
      .max(50, d.aliasMax),
    bankName: z.string({ message: d.bankNameRequired }).min(2),
  });
};

export type AddBankAccountInput = z.infer<ReturnType<typeof getAddBankAccountSchema>>;
