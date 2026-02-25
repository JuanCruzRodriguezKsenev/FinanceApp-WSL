"use client";

import { useEffect } from "react";
import { createContact } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./ContactForm.module.css";

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

        <div className={styles.row}>
          <div className={styles.col1}>
            <Input 
              id="alias" 
              name="alias" 
              type="text" 
              label={dict.aliasLabel}
              error={state?.isErr && state.error.field === "alias" ? state.error.message : undefined}
            />
          </div>
          <div className={styles.col1}>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              label={dict.emailLabel}
              error={state?.isErr && state.error.field === "email" ? state.error.message : undefined}
            />
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.row} style={{ alignItems: 'flex-end' }}>
          <div className={styles.col1}>
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
          <div className={styles.col2}>
            <Input 
              id="initialMethodValue" 
              name="initialMethodValue" 
              placeholder={dict.methodValue}
            />
          </div>
        </div>
      </Form>
    </Card>
  );
}
