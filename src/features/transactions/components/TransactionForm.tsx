"use client";

import { createTransaction } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export function TransactionForm({ dict }: { dict: Dictionary["transactions"] }) {
  const { formAction, state } = useFormAction(createTransaction, {
    onSuccess: () => {
      // Opcional: limpiar campos o mostrar notificación persistente
    }
  });

  return (
    <Card>
      <Form action={formAction} submitLabel={dict.submitButton}>
        <Input 
          id="amount"
          name="amount"
          type="number"
          label={dict.amountLabel}
          placeholder={dict.amountPlaceholder}
          error={state?.isErr && state.error.field === "amount" ? state.error.message : undefined}
          required
        />

        <Input 
          id="cbu"
          name="cbu"
          type="text"
          label={dict.cbuLabel}
          placeholder={dict.cbuPlaceholder}
          error={state?.isErr && state.error.field === "cbu" ? state.error.message : undefined}
          required
        />

        <Input 
          id="description"
          name="description"
          type="text"
          label={dict.descriptionLabel}
          placeholder={dict.descriptionPlaceholder}
          error={state?.isErr && state.error.field === "description" ? state.error.message : undefined}
        />

        {state?.isErr && (
          <Alert 
            type="error" 
            title={`⚠️ ${dict.errorTitle} (${state.error.type})`}
            details={state.error.details?.circuitStatus ? `CIRCUIT_BREAKER_STATE: ${state.error.details.circuitStatus}` : undefined}
          >
            <p>{state.error.message}</p>
          </Alert>
        )}
        
        {state?.isOk && (
          <Alert type="success" title={`✅ ${dict.successCardTitle}`}>
            <pre style={{ margin: 0, fontSize: "0.8em", overflowX: "auto" }}>
              {JSON.stringify(state.value, null, 2)}
            </pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
