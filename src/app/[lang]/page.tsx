import { getDictionary } from "../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../shared/lib/i18n/i18n-config";
import LanguageSwitcher from "../../shared/components/ui/LanguageSwitcher";
import ThemeSelector from "../../shared/components/ui/ThemeSelector";
import { TransactionForm } from "../../features/transactions/components/TransactionForm";
import { BankAccountForm } from "../../features/bank-accounts/components/BankAccountForm";
import { DigitalWalletForm } from "../../features/digital-wallets/components/DigitalWalletForm";
import { cookies } from "next/headers";
import { DEFAULT_THEME, ThemePreference } from "../../shared/constants/theme";
import { Container, Flex } from "../../shared/ui";
import styles from "./page.module.css";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("NEXT_THEME")?.value;
  let theme: ThemePreference = DEFAULT_THEME;
  try { if (rawTheme) theme = JSON.parse(rawTheme); } catch (e) {}

  return (
    <Container className={styles.mainContainer}>
      <div className={styles.actions}>
        <Flex gap={4} align="center">
          <ThemeSelector currentTheme={theme} />
          <LanguageSwitcher currentLocale={lang} labels={dict.language} />
        </Flex>
      </div>

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
  );
}
