import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { TransactionForm } from "../../../features/transactions/components/TransactionForm";
import { TransactionList } from "../../../features/transactions/components/TransactionList";
import { getBankAccounts } from "../../../features/bank-accounts/actions";
import { getDigitalWallets } from "../../../features/digital-wallets/actions";
import { getContacts } from "../../../features/contacts/actions";
import styles from "./page.module.css";

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const [accountsRes, walletsRes, contactsRes] = await Promise.all([
    getBankAccounts(),
    getDigitalWallets(),
    getContacts(),
  ]);

  const accounts = accountsRes.isOk ? accountsRes.value : [];
  const wallets = walletsRes.isOk ? walletsRes.value : [];
  const contacts = contactsRes.isOk ? contactsRes.value : [];

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar.transactions}</h1>
      </header>

      <div className={styles.grid}>
        <div>
          <h2 className={styles.sectionTitle}>{dict.transactions.submitButton}</h2>
          <TransactionForm 
            dict={dict.transactions} 
            accounts={accounts}
            wallets={wallets}
            contacts={contacts}
          />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>{dict.transactions.tableDate}s</h2>
          <Suspense fallback={<p>Cargando transacciones...</p>}>
            <TransactionList dict={dict.transactions} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
