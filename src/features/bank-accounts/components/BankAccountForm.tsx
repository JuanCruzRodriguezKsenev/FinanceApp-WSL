"use client";

import { addBankAccount } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export function BankAccountForm({ dict }: { dict: Dictionary["bankAccounts"] }) {
  const { formAction, state } = useFormAction(addBankAccount);

  return (
    <Card>
      <h3>{dict.title}</h3>
      <Form action={formAction} submitLabel={dict.submitButton}>
        <Input 
          id="cbu" 
          name="cbu" 
          type="text" 
          label={dict.cbuLabel}
          error={state?.isErr && state.error.field === "cbu" ? state.error.message : undefined}
          required 
        />

        <Input 
          id="alias" 
          name="alias" 
          type="text" 
          label={dict.aliasLabel}
          error={state?.isErr && state.error.field === "alias" ? state.error.message : undefined}
          required 
        />

        <Input 
          id="bankName" 
          name="bankName" 
          type="text" 
          label={dict.bankNameLabel}
          error={state?.isErr && state.error.field === "bankName" ? state.error.message : undefined}
          required 
        />

        {state?.isOk === false && (
          <Alert type="error" title={dict.errorMessage}>
            {state.error.message}
          </Alert>
        )}

        {state?.isOk === true && (
          <Alert type="success" title={dict.successMessage}>
            <pre style={{ fontSize: "0.8em" }}>{JSON.stringify(state.value, null, 2)}</pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
