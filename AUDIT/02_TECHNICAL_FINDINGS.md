# 🔍 Reporte Técnico de Hallazgos

Este documento detalla las inconsistencias arquitectónicas, bugs potenciales y deudas técnicas identificadas durante la auditoría.

## 1. 🔴 CRÍTICO: Seguridad y Compliance SaaS
*   **Fallo:** Ausencia de Cabeceras de Seguridad HTTP.
    *   **Contexto:** El archivo `next.config.ts` utiliza la configuración por defecto de Next.js.
    *   **Riesgo:** Vulnerabilidad a ataques XSS, Clickjacking y Sniffing de tipos MIME. Falta de `Content-Security-Policy` (CSP) y `Strict-Transport-Security` (HSTS).
*   **Fallo:** Ausencia de Autenticación y Autorización.
    *   **Contexto:** Actualmente, los endpoints de Server Actions asumen que el usuario que ejecuta la acción está autenticado implícitamente o no hay gestión de identidad.
    *   **Riesgo:** Violación de principios de seguridad SaaS.

## 2. 🟡 MEDIO: Arquitectura (Principio DRY y Data Access Layer)
*   **Fallo:** Acoplamiento directo del ORM en Server Actions (Lógica de Dominio).
    *   **Contexto:** Funciones como `createTransaction` (en `src/features/transactions/actions/index.ts`) inyectan SQL y llamadas `db.transaction()` directamente.
    *   **Riesgo:** Si el ORM cambia o se necesita reutilizar la consulta en un cron-job/worker, el código tendrá que ser duplicado. Viola la recomendación de "Clean Architecture / Hexagonal" referenciada en `ResumenArqSoftware.md`.
    *   **Solución:** Extraer estas consultas a un Data Access Layer (DAL) como `repositories/` o `data/`.

## 3. 🟡 MEDIO: UI/UX y Deuda Técnica de Estilos
*   **Fallo:** Violación de la norma de Estilos Semánticos (Uso de Inline Styles).
    *   **Contexto:** Archivos como `TransactionForm.tsx`, `GoalList.tsx`, y `BankAccountList.tsx` contienen múltiples tags `<div style={{ flex: 1, fontWeight: 'bold', ... }}>`.
    *   **Riesgo:** Rompe el sistema de diseño estricto y la responsividad basada en CSS. Va en contra de la "Rechazo a utilidades masivas" establecido en la Arquitectura.
    *   **Solución:** Mover todos los estilos en línea a archivos `.module.css`.

## 4. 🟢 BAJO: Resiliencia Avanzada (Patrones Faltantes)
*   **Fallo:** Ausencia de Patrón de Idempotencia.
    *   **Contexto:** Un usuario impaciente podría hacer "doble clic" rápido en el botón de transferencia antes de que React 19 cambie el estado de `isPending` a `true`.
    *   **Riesgo:** Cobros o transferencias duplicadas accidentales.
    *   **Solución:** Implementar `Idempotency-Key` basada en tokens de sesión o hash de payload.
