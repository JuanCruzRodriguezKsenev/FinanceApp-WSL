import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { BankAccountForm } from "../../../features/bank-accounts/components/BankAccountForm";
import { BankAccountList } from "../../../features/bank-accounts/components/BankAccountList";
import { DigitalWalletForm } from "../../../features/digital-wallets/components/DigitalWalletForm";
import { DigitalWalletList } from "../../../features/digital-wallets/components/DigitalWalletList";
import { GoalForm } from "../../../features/goals/components/GoalForm";
import { GoalList } from "../../../features/goals/components/GoalList";
import { getBankAccounts } from "../../../features/bank-accounts/actions";
import { getDigitalWallets } from "../../../features/digital-wallets/actions";
import styles from "./page.module.css";

export default async function AccountsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const [accountsRes, walletsRes] = await Promise.all([
    getBankAccounts(),
    getDigitalWallets(),
  ]);

  const accounts = accountsRes.isOk ? accountsRes.value : [];
  const wallets = walletsRes.isOk ? walletsRes.value : [];

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar.accounts}</h1>
      </header>

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

        <section className={styles.sectionLarge}>
          <h2 className={styles.sectionTitle}>{dict.goals.title}</h2>
          <GoalForm dict={dict.goals} accounts={accounts} wallets={wallets} />
          <div className={styles.listContainer}>
            <Suspense fallback={<p>Cargando objetivos...</p>}>
              <GoalList dict={dict.goals} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
