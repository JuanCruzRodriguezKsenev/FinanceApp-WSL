import { z } from "../../../shared/lib/validators";

export const getAddWalletSchema = (dict?: any) => {
  const d = dict || {
    cvuRequired: "CVU is required",
    cvuLength: "CVU must be exactly 22 numbers",
    cvuNumbers: "CVU must only contain numbers",
    providerRequired: "Provider is required",
  };

  return z.object({
    cvu: z
      .string({ message: d.cvuRequired })
      .length(22, d.cvuLength)
      .regex(/^\d+$/, d.cvuNumbers),
    provider: z.string({ message: d.providerRequired }).min(2),
  });
};

export type AddWalletInput = z.infer<ReturnType<typeof getAddWalletSchema>>;
