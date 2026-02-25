import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { BankAccountForm } from "../../../features/bank-accounts/components/BankAccountForm";
import { BankAccountList } from "../../../features/bank-accounts/components/BankAccountList";
import { DigitalWalletForm } from "../../../features/digital-wallets/components/DigitalWalletForm";
import { DigitalWalletList } from "../../../features/digital-wallets/components/DigitalWalletList";
import { CreditCardForm } from "../../../features/wealth/components/CreditCardForm";
import { CreditCardList } from "../../../features/wealth/components/CreditCardList";
import { Tabs } from "../../../shared/ui";
import styles from "./page.module.css";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const bankTab = (
    <div className={styles.grid}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{dict.bankAccounts.title}</h2>
        <BankAccountForm dict={dict.bankAccounts} />
        <div className={styles.listContainer}>
          <Suspense fallback={<p>Cargando cuentas...</p>}>
            <BankAccountList dict={dict.bankAccounts} />
          </Suspense>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{dict.digitalWallets.title}</h2>
        <DigitalWalletForm dict={dict.digitalWallets} />
        <div className={styles.listContainer}>
          <Suspense fallback={<p>Cargando billeteras...</p>}>
            <DigitalWalletList dict={dict.digitalWallets} />
          </Suspense>
        </div>
      </section>
    </div>
  );

  const cardsTab = (
    <div className={styles.grid}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{dict.wealth.creditCardsTitle}</h2>
        <CreditCardForm dict={dict.wealth} />
      </section>
      
      <section className={styles.section}>
        <div className={styles.listContainer}>
          <Suspense fallback={<p>Cargando tarjetas...</p>}>
             <CreditCardList dict={dict.wealth} />
          </Suspense>
        </div>
      </section>
    </div>
  );

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar.accounts}</h1>
      </header>

      <Tabs 
        tabs={[
          { id: "banks", label: "Cuentas y Billeteras", content: bankTab },
          { id: "cards", label: "Tarjetas de Crédito", content: cardsTab }
        ]} 
      />
    </div>
  );
}

