"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n } from "../../../../lib/i18n/i18n-config";
import styles from "./LanguageToggle.module.css";

interface LanguageToggleProps {
  currentLocale: string;
  className?: string;
}

export function LanguageToggle({ currentLocale, className = "" }: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "es" ? "en" : "es";
    if (!pathname) return;

    // Reemplazamos el locale en la ruta
    const newPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    
    // Persistencia
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`${styles.toggle} ${className}`}
      aria-label={`Switch to ${currentLocale === "es" ? "English" : "Español"}`}
    >
      <span className={styles.icon}>🌐</span>
      <span className={styles.text}>
        {currentLocale === "es" ? "ES" : "EN"}
      </span>
    </button>
  );
}
