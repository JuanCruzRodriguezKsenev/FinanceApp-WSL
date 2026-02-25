"use client";

import { useEffect } from "react";
import { createCreditCard } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select, Checkbox } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./WealthForms.module.css";

export function CreditCardForm({ dict }: { dict: Dictionary["wealth"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createCreditCard, {
    onSuccess: () => showToast(dict.successCard, "success")
  });

  useEffect(() => {
    if (state?.isErr) showToast(state.error.message, "error");
  }, [state, showToast]);

  return (
    <Card>
      <h3>{dict.creditCardsTitle}</h3>
      <Form action={formAction} submitLabel={dict.submitCard} error={state?.isErr ? state.error : null}>
        <div className={styles.row}>
          <div className={styles.col1}>
            <Input name="name" label={dict.cardName} required />
          </div>
          <div className={styles.col1}>
            <Input name="bankName" label={dict.cardBank} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col2}>
            <Input name="limit" type="number" label={dict.cardLimit} required />
          </div>
          <div className={styles.col1}>
            <Select name="currency" label={dict.assetCurrency}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col1}>
            <Input name="closingDay" type="number" min="1" max="31" label={dict.cardClosing} />
          </div>
          <div className={styles.col1}>
            <Input name="dueDay" type="number" min="1" max="31" label={dict.cardDue} />
          </div>
        </div>

        <Checkbox name="autoDebit" label={dict.cardAutoDebit} />
      </Form>
    </Card>
  );
}
