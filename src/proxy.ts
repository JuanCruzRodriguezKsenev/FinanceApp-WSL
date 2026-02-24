import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./shared/lib/i18n/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // 1. Verificamos si ya hay un idioma en la cookie "NEXT_LOCALE"
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 2. Negotiator espera un objeto plain de headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Extraemos la lista de lenguajes permitidos del Header Accept-Language del navegador
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Mapeamos los locales de readonly tuple a un array estándar de string
  const locales: string[] = [...i18n.locales];

  try {
    // 3. Match entre lo que pide el navegador y lo que nosotros soportamos
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si la ruta pertenece al sistema de archivos internos de Next.js (_next, static) la ignoramos
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes("favicon.ico") ||
    pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  // Verificamos si la ruta actual ya tiene uno de los locales soportados (/en/... o /es/...)
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirigimos si no hay local en la ruta
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Si la ruta era /dashboard, ahora será /es/dashboard
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Ignoramos todos los archivos estáticos en el matcher del middleware para ganar rendimiento
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
