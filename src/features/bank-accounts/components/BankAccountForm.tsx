"use client";

import { addBankAccount } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Flex, Card, Button, Input, Label, Alert } from "../../../shared/ui";

export function BankAccountForm({ dict }: { dict: any }) {
  const { formAction, isPending, state } = useFormAction(addBankAccount);

  return (
    <Card>
      <form action={formAction}>
        <Flex direction="column" gap={4}>
          <h3>{dict.title}</h3>
          
          <div>
            <Label htmlFor="cbu">{dict.cbuLabel}</Label>
            <Input id="cbu" name="cbu" type="text" required />
          </div>

          <div>
            <Label htmlFor="alias">{dict.aliasLabel}</Label>
            <Input id="alias" name="alias" type="text" required />
          </div>

          <div>
            <Label htmlFor="bankName">{dict.bankNameLabel}</Label>
            <Input id="bankName" name="bankName" type="text" required />
          </div>

          <Button type="submit" isLoading={isPending}>
            {dict.submitButton}
          </Button>
        </Flex>
      </form>

      <div style={{ marginTop: "20px" }}>
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
      </div>
    </Card>
  );
}
