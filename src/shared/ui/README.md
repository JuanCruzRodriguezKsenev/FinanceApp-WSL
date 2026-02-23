# 🎨 Shared UI Library (Semantic & Modular)

Esta carpeta contiene componentes de UI genéricos, accesibles y desacoplados de la lógica de negocio.

## 🚀 Instalación (Copy-Paste)
1. Copia la carpeta `ui/` en tu directorio `shared/` o `components/`.
2. Asegúrate de tener configurados los alias de ruta o usa rutas relativas.
3. **Importante:** Esta librería requiere que definas los siguientes **Design Tokens** en tu CSS global (`globals.css`).

## 💎 Design Tokens Requeridos (CSS Variables)

```css
:root {
  /* Colors */
  --bg-surface: #f9fafb;
  --border-color: #e5e7eb;
  --color-primary: #3b82f6;
  --color-danger: #ef4444;
  --text-base: #111827;
  --text-muted: #6b7280;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;

  /* Typography */
  --font-weight-semibold: 600;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
}
```

## 🏗️ Patrones Utilizados
- **CSS Modules:** Estilos encapsulados sin colisiones.
- **Mediator Pattern:** Los diálogos (`Dialog.tsx`) no conocen su contenido; se comunican mediante callbacks.
- **Semantic HTML:** Uso estricto de etiquetas `nav`, `button`, `table`, etc., con roles ARIA.
- **Zero Utilities:** No depende de Tailwind ni clases globales `u-*`. El layout se maneja mediante composición de componentes (`Flex`, `Container`).
