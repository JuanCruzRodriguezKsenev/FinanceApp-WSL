import { getDictionary } from "../../../shared/lib/i18n/getDictionary";
import type { Locale } from "../../../shared/lib/i18n/i18n-config";
import { ThemeToggle } from "../../../shared/components/ui/ThemeToggle";
import { LanguageToggle } from "../../../shared/ui/layout/Navbar/sections/LanguageToggle";
import styles from "./page.module.css";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>{dict.sidebar?.settings || "Configuración"}</h1>
      </header>

      <div className={styles.settingsCard}>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <h3>Apariencia (Tema)</h3>
            <p>Elige tu tema preferido para la aplicación.</p>
          </div>
          <ThemeToggle variant="text" />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <h3>Idioma</h3>
            <p>Selecciona el idioma de la interfaz.</p>
          </div>
          <LanguageToggle currentLocale={lang} />
        </div>
      </div>
    </div>
  );
}
