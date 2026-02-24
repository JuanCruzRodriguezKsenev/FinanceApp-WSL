import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { i18n } from "../../shared/lib/i18n/i18n-config";
import { cookies } from "next/headers";
import { ThemePreference, DEFAULT_THEME } from "../../shared/constants/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance App 3.0",
  description: "Advanced Finance Architecture Sandbox",
};

// Genera rutas estáticas para nuestros idiomas configurados
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

import { ThemeProvider, ToastProvider } from "@/contexts";

// Para inyectar el tema correctamente necesitamos leer la cookie que pre-renderiza Next.js
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  
  // Obtenemos la preferencia del tema para inyección SSR (Zero FOUC)
  const cookieStore = await cookies();
  const rawTheme = cookieStore.get("NEXT_THEME")?.value;
  let theme: ThemePreference = DEFAULT_THEME;

  try {
    if (rawTheme) theme = JSON.parse(rawTheme);
  } catch {
    // Falla silente, se usa DEFAULT_THEME (claro/azul)
  }

  return (
    <html lang={lang} data-theme={theme.mode} data-color={theme.color}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider initialTheme={theme.mode as any}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
