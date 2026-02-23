"use client";

import { useTransition } from "react";
import { setThemePreference } from "../../actions/theme";
import { ThemePreference, THEME_COLORS, THEME_MODES } from "../../constants/theme";

export default function ThemeSelector({ currentTheme }: { currentTheme: ThemePreference }) {
  const [isPending, startTransition] = useTransition();

  const handleModeChange = (mode: string) => {
    // Usamos startTransition para que el UI del navegador se actualice de forma no bloqueante
    // cuando el Server Action refresca la página
    startTransition(() => {
      setThemePreference({ mode: mode as any });
    });
  };

  const handleColorChange = (color: string) => {
    startTransition(() => {
      setThemePreference({ color: color as any });
    });
  };

  return (
    <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100, display: "flex", gap: "10px", alignItems: "center" }}>
      
      {/* Selector de Modo (Light/Dark) */}
      <select 
        value={currentTheme.mode} 
        onChange={(e) => handleModeChange(e.target.value)}
        disabled={isPending}
        style={{ padding: "5px", borderRadius: "5px", border: "1px solid var(--border-color)", background: "var(--bg-input)", color: "var(--text-base)" }}
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
      </select>

      {/* Selector de Paletas de Color */}
      <div style={{ display: "flex", gap: "5px" }}>
        {THEME_COLORS.map((color) => {
          // Asignamos el valor hexadecimal directo solo para el cuadrito visual de la UI
          const hexMap: Record<string, string> = { blue: "#3b82f6", emerald: "#10b981", purple: "#8b5cf6", orange: "#f97316" };
          return (
            <button
              key={color}
              disabled={isPending}
              onClick={() => handleColorChange(color)}
              aria-label={`Color ${color}`}
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                border: currentTheme.color === color ? "2px solid var(--text-base)" : "2px solid transparent",
                backgroundColor: hexMap[color],
                cursor: "pointer",
                opacity: isPending ? 0.6 : 1,
              }}
            />
          );
        })}
      </div>
      
    </div>
  );
}
