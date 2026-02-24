"use client";

import { useEffect } from "react";
import { createContact } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select, Flex } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";

export function ContactForm({ dict }: { dict: Dictionary["contacts"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createContact, {
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
      <h3>{dict.addTitle}</h3>
      <Form 
        action={formAction} 
        submitLabel={dict.submitButton}
        error={state?.isErr ? state.error : null}
      >
        <Input 
          id="name" 
          name="name" 
          type="text" 
          label={dict.nameLabel}
          error={state?.isErr && state.error.field === "name" ? state.error.message : undefined}
          required 
        />

        <Flex gap={4}>
          <Input 
            id="alias" 
            name="alias" 
            type="text" 
            label={dict.aliasLabel}
            error={state?.isErr && state.error.field === "alias" ? state.error.message : undefined}
          />
          <Input 
            id="email" 
            name="email" 
            type="email" 
            label={dict.emailLabel}
            error={state?.isErr && state.error.field === "email" ? state.error.message : undefined}
          />
        </Flex>

        <hr style={{ margin: '1rem 0', opacity: 0.1 }} />

        <Flex gap={4} align="end">
          <div style={{ flex: 1 }}>
            <Select 
              id="initialMethodType" 
              name="initialMethodType" 
              label={dict.methodType}
            >
              <option value="CBU">CBU</option>
              <option value="CVU">CVU</option>
              <option value="Alias">Alias</option>
              <option value="WalletAddress">Wallet</option>
            </Select>
          </div>
          <div style={{ flex: 2 }}>
            <Input 
              id="initialMethodValue" 
              name="initialMethodValue" 
              placeholder={dict.methodValue}
            />
          </div>
        </Flex>
      </Form>
    </Card>
  );
}
