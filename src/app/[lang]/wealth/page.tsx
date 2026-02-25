import { Suspense } from "react";
import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { AssetForm } from "../../../features/wealth/components/AssetForm";
import { LiabilityForm } from "../../../features/wealth/components/LiabilityForm";
import { CreditCardForm } from "../../../features/wealth/components/CreditCardForm";
import { WealthList } from "../../../features/wealth/components/WealthList";
import styles from "./page.module.css";

export default async function WealthPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.wealth.title}</h1>
      </header>

      <div className={styles.formsGrid}>
        <AssetForm dict={dict.wealth} />
        <LiabilityForm dict={dict.wealth} />
        <CreditCardForm dict={dict.wealth} />
      </div>

      <div className={styles.listSection}>
        <Suspense fallback={<p>Cargando patrimonio...</p>}>
          <WealthList dict={dict.wealth} />
        </Suspense>
      </div>
    </div>
  );
}
