"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ThemePreference, THEME_MODES, THEME_COLORS, DEFAULT_THEME } from "../constants/theme";

/**
 * Server Action que actualiza la preferencia de tema en las cookies
 * y fuerza un re-render del servidor de la ruta actual para aplicar el cambio.
 */
export async function setThemePreference(pref: Partial<ThemePreference>) {
  const cookieStore = await cookies();
  
  // Obtenemos el tema actual de la cookie o usamos el default
  const rawCookie = cookieStore.get("NEXT_THEME")?.value;
  let currentTheme: ThemePreference = { ...DEFAULT_THEME };
  
  try {
    if (rawCookie) currentTheme = JSON.parse(rawCookie);
  } catch (e) {
    // Si la cookie está corrupta, nos quedamos con el fallback (DEFAULT_THEME)
  }

  // Fusionamos y validamos la nueva preferencia
  const newMode = THEME_MODES.includes(pref.mode as any) ? pref.mode : currentTheme.mode;
  const newColor = THEME_COLORS.includes(pref.color as any) ? pref.color : currentTheme.color;
  
  const newTheme: ThemePreference = { mode: newMode as any, color: newColor as any };

  // Guardamos la nueva cookie por 1 año
  cookieStore.set("NEXT_THEME", JSON.stringify(newTheme), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false, // Accesible por componentes UI si lo necesitan
    sameSite: "lax",
  });

  // Re-validamos la caché (esto hará que la pantalla aplique el tema sin parpadear)
  revalidatePath("/", "layout");
}
