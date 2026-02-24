"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts";

import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  variant?: "icon" | "text" | "full";
  className?: string;
}

export function ThemeToggle({
  variant = "icon",
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar error de hidratación: el servidor no sabe el tema local del cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    if (!mounted) return "☀️"; // Icono por defecto estable para hidratación
    if (theme === "system") return "💻";
    return resolvedTheme === "light" ? "☀️" : "🌙";
  };

  const getLabel = () => {
    if (!mounted) return "Cargando...";
    switch (theme) {
      case "light":
        return "Claro";
      case "dark":
        return "Oscuro";
      case "system":
        return "Sistema";
      default:
        return "";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={`${styles.toggle} ${styles[variant]} ${className}`}
      aria-label={mounted ? `Cambiar tema (actual: ${getLabel()})` : "Cambiar tema"}
      title={mounted ? `Tema actual: ${getLabel()}` : "Cargando tema..."}
    >
      {variant === "icon" && <span className={styles.icon}>{getIcon()}</span>}

      {variant === "text" && <span className={styles.text}>{getLabel()}</span>}

      {variant === "full" && (
        <>
          <span className={styles.icon}>{getIcon()}</span>
          <span className={styles.text}>{getLabel()}</span>
        </>
      )}
    </button>
  );
}

