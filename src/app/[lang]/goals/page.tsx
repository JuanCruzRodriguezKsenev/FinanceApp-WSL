import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { GoalForm } from "../../../features/goals/components/GoalForm";
import { GoalList } from "../../../features/goals/components/GoalList";
import { getBankAccounts } from "../../../features/bank-accounts/actions";
import { getDigitalWallets } from "../../../features/digital-wallets/actions";
import styles from "./page.module.css";

export default async function GoalsPage({
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
        <h1 className={styles.title}>{dict.goals.title}</h1>
      </header>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{dict.goals.addTitle}</h2>
          <GoalForm dict={dict.goals} accounts={accounts} wallets={wallets} />
        </section>

        <section className={styles.section}>
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
