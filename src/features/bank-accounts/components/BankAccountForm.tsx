"use client";

import { useEffect } from "react";
import { addBankAccount } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form, Flex, Select } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";

export function BankAccountForm({ dict }: { dict: Dictionary["bankAccounts"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(addBankAccount, {
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

        <Flex gap={4}>
          <div style={{ flex: 2 }}>
            <Input 
              id="balance" 
              name="balance" 
              type="number" 
              label="Saldo Inicial"
              defaultValue="0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select id="currency" name="currency" label="Moneda">
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </Flex>

        {state?.isOk === true && (
          <Alert type="success" title={dict.successMessage}>
            <pre style={{ fontSize: "0.8em" }}>{JSON.stringify(state.value, null, 2)}</pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
