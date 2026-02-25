# 🗺️ Roadmap y Acción de Remediación

Pasos específicos y ordenados por prioridad para corregir los hallazgos técnicos.

## Fase 1: Hotfixes Críticos de Seguridad y UI (Inmediato)
1.  **Asegurar `next.config.ts`**: Inyectar headers de seguridad estándar de industria (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).
2.  **Limpieza UI Estricta**: Refactorizar todos los componentes React en `src/features` para eliminar la propiedad `style` y utilizar las clases de los `CSS Modules`.

## Fase 2: Refactorización Arquitectónica (DAL)
1.  **Crear el Data Access Layer (DAL)**: 
    *   Crear `src/features/transactions/data/transaction.repository.ts`.
    *   Mover las queries de Drizzle fuera de `actions/index.ts`.
    *   Asegurar que el repositorio acepte una transacción de Drizzle (`tx`) para mantener el soporte ACID.

## Fase 3: Identidad y Seguridad de Flujos (A corto plazo)
1.  **Idempotencia**: Añadir middleware o lógica a la validación de transacciones que detecte payloads duplicados en ventanas de tiempo de 5 segundos.
2.  **Auth.js v5**: Implementar esquema de autenticación (Identity Provider) forzando cookies `HttpOnly` y protección en `src/proxy.ts`.

## Fase 4: Nuevas Funcionalidades (A mediano plazo)
1.  **Motor de Patrimonio (Wealth Management)**: Continuar con el plan previo (`BACKEND_PLAN/`) desarrollando la tabla de Activos (Inmuebles, Acciones).
