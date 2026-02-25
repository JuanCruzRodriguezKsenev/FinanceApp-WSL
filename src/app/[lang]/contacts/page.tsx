import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { ContactForm } from "../../../features/contacts/components/ContactForm";
import { ContactList } from "../../../features/contacts/components/ContactList";
import styles from "./page.module.css";

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar.contacts}</h1>
      </header>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.sectionTitle}>{dict.contacts.addTitle}</h2>
          <ContactForm dict={dict.contacts} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>{dict.contacts.title}</h2>
          <Suspense fallback={<p>Cargando contactos...</p>}>
            <ContactList dict={dict.contacts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
