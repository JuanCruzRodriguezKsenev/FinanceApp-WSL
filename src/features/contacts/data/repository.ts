import { db } from "../../../shared/lib/db";
import { contacts, contactMethods } from "../schema.db";
import { desc, eq } from "drizzle-orm";
import type { CreateContactInput, AddContactMethodInput } from "../schemas";

export const contactRepository = {
  async findAll() {
    // Intentamos la query relacional
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
  },

  async create(validData: CreateContactInput, tx: any) {
    const [insertedContact] = await tx.insert(contacts).values({
      name: validData.name,
      alias: validData.alias,
      email: validData.email,
    }).returning();

    if (validData.initialMethodValue && validData.initialMethodType) {
      await tx.insert(contactMethods).values({
        contactId: insertedContact.id,
        type: validData.initialMethodType,
        value: validData.initialMethodValue,
        isDefault: true,
      });
    }

    return insertedContact;
  }
};
