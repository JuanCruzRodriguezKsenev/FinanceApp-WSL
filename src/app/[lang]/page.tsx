import { getTransactions } from "../../features/transactions/actions";
import { getBankAccounts } from "../../features/bank-accounts/actions";
import { getDigitalWallets } from "../../features/digital-wallets/actions";
import { getWealthData } from "../../features/wealth/actions";

import { Container } from "../../shared/ui";
import { Dictionary } from "../../shared/lib/i18n/types";
import { getDictionary } from "../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../shared/lib/i18n/i18n-config";
import styles from "./page.module.css";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Aquí podemos cargar un resumen ligero. Por ahora solo cálculos básicos.
  const [accRes, walRes, wealthRes] = await Promise.all([
    getBankAccounts(),
    getDigitalWallets(),
    getWealthData()
  ]);

  const bankTotal = accRes.isOk ? accRes.value.reduce((acc: number, curr: any) => acc + Number(curr.balance), 0) : 0;
  const walletTotal = walRes.isOk ? walRes.value.reduce((acc: number, curr: any) => acc + Number(curr.balance), 0) : 0;
  const liquidTotal = bankTotal + walletTotal;

  let assetsTotal = 0;
  let debtsTotal = 0;

  if (wealthRes.isOk) {
    assetsTotal = wealthRes.value.assets.reduce((acc: number, curr: any) => acc + Number(curr.value), 0);
    debtsTotal = wealthRes.value.liabilities.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  }

  const netWorth = liquidTotal + assetsTotal - debtsTotal;

  return (
    <Container>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar.dashboard}</h1>
        <p className={styles.subtitle}>Resumen Financiero</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Patrimonio Neto</h3>
          <p className={styles.statValue}>${netWorth.toLocaleString()}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Liquidez (Bancos + Billeteras)</h3>
          <p className={styles.statValue}>${liquidTotal.toLocaleString()}</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Deudas</h3>
          <p className={styles.statValueNegative}>
            -${debtsTotal.toLocaleString()}
          </p>
        </div>
      </div>
    </Container>
  );
}
