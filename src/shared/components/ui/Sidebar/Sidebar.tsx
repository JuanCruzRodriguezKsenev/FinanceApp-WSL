"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";
import { LanguageToggle } from "../../../ui/layout/Navbar/sections/LanguageToggle";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  lang: string;
  dict: any;
}

export function Sidebar({ lang, dict }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === `/${lang}`) {
      return pathname === `/${lang}`;
    }
    return pathname.startsWith(`/${lang}${path}`);
  };

  const navItems = [
    { href: `/${lang}`, label: dict.dashboard, icon: "📊" },
    { href: `/${lang}/transactions`, label: dict.transactions, icon: "💸" },
    { href: `/${lang}/accounts`, label: dict.accounts, icon: "🏦" },
    { href: `/${lang}/wealth`, label: dict.wealth, icon: "💎" },
    { href: `/${lang}/contacts`, label: dict.contacts, icon: "👥" },
    { href: `/${lang}/settings`, label: dict.settings || "Settings", icon: "⚙️" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.brand}>FinanceApp</div>
      </div>

      <div className={styles.userProfile}>
        <div className={styles.avatar}>U</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>Usuario Demo</div>
          <div className={styles.userEmail}>demo@finance.app</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

