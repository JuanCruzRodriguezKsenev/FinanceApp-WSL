import { Suspense } from "react";
import { getDictionary } from "../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../shared/lib/i18n/i18n-config";
import { ThemeToggle } from "../../shared/components/ui/ThemeToggle";
import { TransactionForm } from "../../features/transactions/components/TransactionForm";
import { TransactionList } from "../../features/transactions/components/TransactionList";
import { BankAccountForm } from "../../features/bank-accounts/components/BankAccountForm";
import { BankAccountList } from "../../features/bank-accounts/components/BankAccountList";
import { DigitalWalletForm } from "../../features/digital-wallets/components/DigitalWalletForm";
import { DigitalWalletList } from "../../features/digital-wallets/components/DigitalWalletList";
import { 
  Container, 
  Navbar, 
  NavbarBrand, 
  NavbarEnd, 
  LanguageToggle,
  Flex
} from "../../shared/ui";
import styles from "./page.module.css";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Navbar sticky shadow padding="medium">
        <NavbarBrand>
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            FinanceApp
          </span>
        </NavbarBrand>
        <NavbarEnd gap="small">
          <ThemeToggle variant="icon" />
          <LanguageToggle currentLocale={lang} />
        </NavbarEnd>
      </Navbar>

      <Container className={styles.mainContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>{dict.transactions.title}</h1>
          <p className={styles.subtitle}>{dict.transactions.subtitle}</p>
        </header>

        <Flex direction="column" gap={8}>
          {/* SECCIÓN TRANSACCIONES */}
          <section className={styles.section}>
            <div className={styles.grid}>
              <div>
                <h2 className={styles.sectionTitle}>{dict.transactions.submitButton}</h2>
                <TransactionForm dict={dict.transactions} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>{dict.transactions.tableDate}s</h2>
                <Suspense fallback={<p>Cargando transacciones...</p>}>
                  <TransactionList dict={dict.transactions} />
                </Suspense>
              </div>
            </div>
          </section>

          <div className={styles.grid}>
            {/* SECCIÓN CUENTAS */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{dict.bankAccounts.title}</h2>
              <BankAccountForm dict={dict.bankAccounts} />
              <div style={{ marginTop: "1rem" }}>
                <Suspense fallback={<p>Cargando cuentas...</p>}>
                  <BankAccountList dict={dict.bankAccounts} />
                </Suspense>
              </div>
            </section>

            {/* SECCIÓN BILLETERAS */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{dict.digitalWallets.title}</h2>
              <DigitalWalletForm dict={dict.digitalWallets} />
              <div style={{ marginTop: "1rem" }}>
                <Suspense fallback={<p>Cargando billeteras...</p>}>
                  <DigitalWalletList dict={dict.digitalWallets} />
                </Suspense>
              </div>
            </section>
          </div>
        </Flex>
      </Container>
    </>
  );
}
