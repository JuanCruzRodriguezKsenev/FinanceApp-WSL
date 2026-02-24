import { z } from "../../../shared/lib/validators";

export const getCreateContactSchema = (dict?: any) => {
  const d = dict || {
    nameRequired: "Name is required",
    nameMin: "Name must be at least 2 characters",
    emailInvalid: "Invalid email address",
    aliasMax: "Alias is too long"
  };

  return z.object({
    name: z.string({ message: d.nameRequired }).min(2, d.nameMin),
    alias: z.string().max(50, d.aliasMax).optional(),
    email: z.string().email(d.emailInvalid).optional().or(z.literal("")),
    initialMethodValue: z.string().optional(),
    initialMethodType: z.enum(["CBU", "CVU", "Alias", "WalletAddress"]).optional(),
  });
};

export const getAddContactMethodSchema = (dict?: any) => {
  const d = dict || {
    typeRequired: "Type is required",
    valueRequired: "Value is required",
    valueLength: "CBU/CVU must be 22 digits",
    valueInvalid: "Invalid format"
  };

  return z.object({
    contactId: z.string().uuid(),
    type: z.enum(["CBU", "CVU", "Alias", "WalletAddress"], { message: d.typeRequired }),
    value: z.string({ message: d.valueRequired }).min(3, d.valueInvalid),
    label: z.string().optional(),
    isDefault: z.coerce.boolean().default(false),
  });
};

export type CreateContactInput = z.infer<ReturnType<typeof getCreateContactSchema>>;
export type AddContactMethodInput = z.infer<ReturnType<typeof getAddContactMethodSchema>>;
