"use client";

import { useEffect } from "react";
import { addDigitalWallet } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";

export function DigitalWalletForm({ dict }: { dict: Dictionary["digitalWallets"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(addDigitalWallet, {
    onSuccess: () => {
      showToast(dict.successMessage, "success");
    }
  });

  useEffect(() => {
    if (state?.isErr) {
      showToast(state.error.message, "error");
    }
  }, [state, showToast]);

  return (
    <Card>
      <h3>{dict.title}</h3>
      <Form 
        action={formAction} 
        submitLabel={dict.submitButton}
        error={state?.isErr ? state.error : null}
        errorTitle={state?.isErr && state.error.type !== "CONFLICT_ERROR" ? dict.errorMessage : undefined}
      >
        <Input 
          id="cvu" 
          name="cvu" 
          type="text" 
          label={dict.cvuLabel}
          error={state?.isErr && state.error.field === "cvu" ? state.error.message : undefined}
          required 
        />

        <Input 
          id="provider" 
          name="provider" 
          type="text" 
          label={dict.providerLabel}
          error={state?.isErr && state.error.field === "provider" ? state.error.message : undefined}
          required 
        />

        {state?.isOk === true && (
          <Alert type="success" title={dict.successMessage}>
            <pre style={{ fontSize: "0.8em" }}>{JSON.stringify(state.value, null, 2)}</pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
