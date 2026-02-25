"use client";

import { useEffect } from "react";
import { createGoal } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select, Flex } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./GoalForm.module.css";

interface Props {
  dict: Dictionary["goals"];
  accounts: any[];
  wallets: any[];
}

export function GoalForm({ dict, accounts, wallets }: Props) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createGoal, {
    onSuccess: () => {
      showToast(dict.successMessage, "success");
    }
  });

  const allOwnAccounts = [
    ...accounts.map(a => ({ id: a.id, name: `${a.bankName} - ${a.alias}`, type: 'account' })),
    ...wallets.map(w => ({ id: w.id, name: w.provider, type: 'wallet' }))
  ];

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
          required 
        />

        <div className={styles.row}>
          <div className={styles.col1}>
            <Select id="type" name="type" label={dict.typeLabel} required>
              <option value="GOAL">Objetivo</option>
              <option value="RESERVE">Reserva</option>
            </Select>
          </div>
          <div className={styles.col1}>
            <Select id="currency" name="currency" label="Moneda">
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col1}>
            <Input 
              id="targetAmount" 
              name="targetAmount" 
              type="number" 
              label={dict.targetAmountLabel}
              required 
            />
          </div>
          <div className={styles.col1}>
            <Input 
              id="deadline" 
              name="deadline" 
              type="date" 
              label={dict.deadlineLabel}
            />
          </div>
        </div>

        <Select id="bankAccountId" name="bankAccountId" label={dict.linkedAccountLabel}>
          <option value="">Cuenta vinculada (Opcional)</option>
          {allOwnAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </Select>
      </Form>
    </Card>
  );
}
