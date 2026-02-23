"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n } from "../../lib/i18n/i18n-config";

export default function LanguageSwitcher({ 
  currentLocale, 
  labels 
}: { 
  currentLocale: string;
  labels: Record<string, string>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Si la ruta actual no existe, esto previene que se bloquee el selector
    if (!pathname) return;

    // Removemos el locale actual de la ruta (ej. "/es/dashboard" -> "/dashboard")
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
    
    // Setear cookie global y forzar redirección client-side. El middleware detectará 
    // y aplicará correctamente el nuevo prefijo sin perder el scroll state
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // Expira 1 año
    
    // Redirigimos al usuario a la nueva ruta
    router.push(`/${newLocale}${pathWithoutLocale}`);
    router.refresh(); // Forzamos un re-render del RSC Tree para jalar nuevos diccionarios JSON
  };

  return (
    <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 100 }}>
      <label htmlFor="locale-switcher" style={{ marginRight: "10px", fontSize: "0.9rem" }}>
        {labels.switch}:
      </label>
      <select 
        id="locale-switcher"
        value={currentLocale} 
        onChange={handleLanguageChange}
        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
      >
        {i18n.locales.map((locale) => (
          <option key={locale} value={locale}>
            {labels[locale] || locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
