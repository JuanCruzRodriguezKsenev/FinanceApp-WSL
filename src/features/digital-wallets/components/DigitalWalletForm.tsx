"use client";

import { addDigitalWallet } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Flex, Card, Button, Input, Label, Alert } from "../../../shared/ui";

export function DigitalWalletForm({ dict }: { dict: any }) {
  const { formAction, isPending, state } = useFormAction(addDigitalWallet);

  return (
    <Card>
      <form action={formAction}>
        <Flex direction="column" gap={4}>
          <h3>{dict.title}</h3>
          
          <div>
            <Label htmlFor="cvu">{dict.cvuLabel}</Label>
            <Input id="cvu" name="cvu" type="text" required />
          </div>

          <div>
            <Label htmlFor="provider">{dict.providerLabel}</Label>
            <Input id="provider" name="provider" type="text" required />
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
