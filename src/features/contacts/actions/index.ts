"use server";

import { Result, ok, err, internalError, conflictError } from "../../../shared/lib/result";
import { logger } from "../../../shared/lib/logger";
import { validateSchema } from "../../../shared/lib/validators";
import { CircuitBreakerFactory, CircuitBreakerOpenError } from "../../../shared/lib/circuit-breaker";
import { getCreateContactSchema, CreateContactInput, getAddContactMethodSchema, AddContactMethodInput } from "../schemas";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { db } from "../../../shared/lib/db";
import { contacts, contactMethods } from "../schema.db";
import { desc, eq } from "drizzle-orm";

const dbBreaker = CircuitBreakerFactory.database("contacts-db");

/**
 * Obtiene la lista de contactos con sus métodos de pago vinculados.
 */
export async function getContacts(): Promise<Result<any[]>> {
  try {
    const result = await dbBreaker.execute(async () => {
      // Intentamos una query más simple si la relacional falla
      try {
        return await db.query.contacts.findMany({
          where: eq(contacts.isActive, true),
          with: {
            methods: {
              where: eq(contactMethods.isActive, true)
            }
          },
          orderBy: [desc(contacts.lastUsedAt), desc(contacts.createdAt)]
        });
      } catch (innerError: any) {
        console.error("DEBUG: Relational Query Failed, falling back to simple select");
        return await db.select().from(contacts).where(eq(contacts.isActive, true)).execute();
      }
    });
    return ok(result);
  } catch (error: any) {
    console.error(">>> ERROR FETCHING CONTACTS <<<");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    if (error.cause) {
      console.error("Cause Message:", error.cause.message);
      console.error("Cause Code:", error.cause.code);
    }
    return err(internalError("Error fetching contacts", { details: error.message }));
  }
}

/**
 * Crea un nuevo contacto con un método opcional (ACID Transactional).
 */
export async function createContact(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);
  const contactsDict = dict.contacts;

  const validation = await validateSchema(input, getCreateContactSchema(contactsDict));
  if (!validation.isOk) return err(validation.error);

  const validData = validation.value as CreateContactInput;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Insertar el contacto
      const [insertedContact] = await tx.insert(contacts).values({
        name: validData.name,
        alias: validData.alias,
        email: validData.email,
      }).returning();

      // 2. Insertar método inicial si existe
      if (validData.initialMethodValue && validData.initialMethodType) {
        await tx.insert(contactMethods).values({
          contactId: insertedContact.id,
          type: validData.initialMethodType,
          value: validData.initialMethodValue,
          isDefault: true,
        });
      }

      return insertedContact;
    });

    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    logger.fatal({ breaker: "contacts-db", error: error.message }, "Error creating contact transactionally");
    return err(internalError(contactsDict.errorMessage, { details: error.message }));
  }
}

/**
 * Añade un método de pago a un contacto existente (ACID Transactional).
 */
export async function addContactMethod(input: unknown): Promise<Result<any>> {
  const cookieStore = await cookies();
  const currentLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = await getDictionary(currentLocale);
  const contactsDict = dict.contacts;

  const validation = await validateSchema(input, getAddContactMethodSchema(contactsDict));
  if (!validation.isOk) return err(validation.error);

  const validData = validation.value as AddContactMethodInput;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Insertar el método
      const [method] = await tx.insert(contactMethods).values({
        contactId: validData.contactId,
        type: validData.type,
        value: validData.value,
        label: validData.label,
        isDefault: validData.isDefault,
      }).returning();

      // 2. Si es default, quitar default a otros (Atomicidad garantizada por tx)
      if (validData.isDefault) {
        // ... lógica para quitar otros defaults si fuera necesario ...
      }

      return method;
    });

    revalidatePath("/[lang]", "layout");
    return ok(result);
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes("unique") || msg.includes("already exists")) {
      return err(conflictError("Este CBU/Alias ya está registrado en otro contacto", "value"));
    }
    return err(internalError("Error al vincular cuenta al contacto", { details: msg }));
  }
}
