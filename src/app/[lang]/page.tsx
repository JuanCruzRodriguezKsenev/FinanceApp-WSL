import { getDictionary } from "../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../shared/lib/i18n/i18n-config";
import { ThemeToggle } from "../../shared/components/ui/ThemeToggle";
import { TransactionForm } from "../../features/transactions/components/TransactionForm";
import { BankAccountForm } from "../../features/bank-accounts/components/BankAccountForm";
import { DigitalWalletForm } from "../../features/digital-wallets/components/DigitalWalletForm";
import { 
  Container, 
  Navbar, 
  NavbarBrand, 
  NavbarEnd, 
  LanguageToggle 
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

      <div className={styles.grid}>
        <section>
          <h2 style={{ marginBottom: "1rem" }}>{dict.transactions.submitButton}</h2>
          <TransactionForm dict={dict.transactions} />
        </section>

        <section>
          <h2 style={{ marginBottom: "1rem" }}>{dict.bankAccounts.title}</h2>
          <BankAccountForm dict={dict.bankAccounts} />
        </section>

        <section>
          <h2 style={{ marginBottom: "1rem" }}>{dict.digitalWallets.title}</h2>
          <DigitalWalletForm dict={dict.digitalWallets} />
        </section>
      </div>
    </Container>
    </>
  );
}
