import { z } from "../../../shared/lib/validators";

export const getCreateGoalSchema = (dict?: any) => {
  const d = dict || {
    nameRequired: "Name is required",
    typeRequired: "Type is required",
    amountRequired: "Target amount is required",
    amountPositive: "Amount must be positive",
    currencyRequired: "Currency is required",
  };

  return z.object({
    name: z.string({ message: d.nameRequired }).min(2),
    type: z.enum(["GOAL", "RESERVE"], { message: d.typeRequired }),
    targetAmount: z.coerce.number({ message: d.amountRequired }).positive(d.amountPositive),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
    bankAccountId: z.string().uuid().optional().nullable(),
    digitalWalletId: z.string().uuid().optional().nullable(),
    deadline: z.string().optional().nullable(),
  });
};

export const getAllocateAmountSchema = (dict?: any) => {
  const d = dict || {
    amountRequired: "Amount is required",
    amountPositive: "Amount must be positive",
    goalIdRequired: "Goal ID is required",
  };

  return z.object({
    goalId: z.string().uuid({ message: d.goalIdRequired }),
    amount: z.coerce.number({ message: d.amountRequired }).positive(d.amountPositive),
  });
};

export type CreateGoalInput = z.infer<ReturnType<typeof getCreateGoalSchema>>;
export type AllocateAmountInput = z.infer<ReturnType<typeof getAllocateAmountSchema>>;
