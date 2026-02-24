"use client";

import { useEffect } from "react";
import { createTransaction } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";

export function TransactionForm({ dict }: { dict: Dictionary["transactions"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createTransaction, {
    onSuccess: (data) => {
      showToast(`${dict.successCardTitle}: ${data.id}`, "success");
    }
  });

  useEffect(() => {
    if (state?.isErr) {
      showToast(state.error.message, "error");
    }
  }, [state, showToast]);

  return (
    <Card>
      <Form 
        action={formAction} 
        submitLabel={dict.submitButton}
        error={state?.isErr ? state.error : null}
        errorTitle={state?.isErr && state.error.type !== "CONFLICT_ERROR" ? `⚠️ ${dict.errorTitle} (${state.error.type})` : undefined}
      >
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
