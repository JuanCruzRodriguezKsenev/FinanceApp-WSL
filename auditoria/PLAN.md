# 🚀 Plan de Desarrollo y Mejoras (TODO)

Este plan detalla las tareas necesarias para elevar la calidad del proyecto siguiendo las recomendaciones de la auditoría.

## 🔴 Alta Prioridad (Resiliencia y Estándares)
- [x] **Migrar `middleware.ts` a la nueva convención de Next.js 16:** Investigar y aplicar el sistema de `proxy` para evitar avisos de deprecación.
- [x] **Refactorizar Circuit Breaker (HALF_OPEN):** 
  - [x] Asegurar que cualquier fallo en `HALF_OPEN` cambie el estado a `OPEN` inmediatamente.
  - [x] Implementar un log específico para transiciones de estado del circuito.
- [x] **Validación de Entorno en Build:** Crear un script `src/shared/lib/env.ts` que valide la presencia de variables críticas al arrancar la app.

## 🟡 Media Prioridad (DX y Consistencia)
- [x] **Estandarizar Componentes de Tabla:** 
  - [x] Refactorizar `Table.tsx` para usar `TableHeader`, `TableRow` y `TableCell`.
- [x] **Unificar Formularios:** 
  - [x] Migrar todos los formularios de features (`DigitalWalletForm`, `BankAccountForm`, `TransactionForm`) para usar el componente `Form.tsx` modular.
- [x] **Tipado Estricto de Dictionaries:** Crear un tipo global derivado de `es.json` para evitar el uso de `any` en los diccionarios de i18n.

## 🟢 Baja Prioridad (Optimización y UX)
- [ ] **Mejorar LanguageSwitcher:** Utilizar el nuevo patrón de navegación de Next.js 16 para cambios de idioma sin recarga completa del cliente.
- [ ] **Expandir Tests de Integración:** 
  - [ ] Crear tests para `createTransaction` que simulen fallos de base de datos y verifiquen la apertura del Circuit Breaker.
- [ ] **Documentación de API Interna:** Añadir JSDoc a todas las funciones de `shared/lib` para mejorar la experiencia de desarrollo (IntelliSense).

---

## 📝 Notas de Implementación
*   Todas las refactorizaciones de UI deben mantener el principio de **Zero Utilities CSS**.
*   El manejo de errores debe seguir respetando el **Result Pattern** para no romper la serialización de RSC.
