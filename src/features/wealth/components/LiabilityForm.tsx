"use client";

import { useEffect } from "react";
import { createLiability } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./WealthForms.module.css";

export function LiabilityForm({ dict }: { dict: Dictionary["wealth"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createLiability, {
    onSuccess: () => showToast(dict.successLiability, "success")
  });

  useEffect(() => {
    if (state?.isErr) showToast(state.error.message, "error");
  }, [state, showToast]);

  return (
    <Card>
      <h3>{dict.liabilitiesTitle}</h3>
      <Form action={formAction} submitLabel={dict.submitLiability} error={state?.isErr ? state.error : null}>
        <Input name="name" label={dict.liabilityName} required />
        
        <Select name="type" label={dict.liabilityType} required>
          <option value="PERSONAL_LOAN">{dict.types.PERSONAL_LOAN}</option>
          <option value="MORTGAGE">{dict.types.MORTGAGE}</option>
          <option value="OTHER">{dict.types.OTHER}</option>
        </Select>

        <div className={styles.row}>
          <div className={styles.col2}>
            <Input name="amount" type="number" label={dict.liabilityAmount} required />
          </div>
          <div className={styles.col1}>
            <Select name="currency" label={dict.assetCurrency}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </div>
      </Form>
    </Card>
  );
}
