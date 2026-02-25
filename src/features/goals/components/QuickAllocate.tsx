"use client";

import { useState } from "react";
import { allocateMoney } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Button, Input } from "../../../shared/ui";
import { useToast } from "@/contexts";
import styles from "./QuickAllocate.module.css";

export function QuickAllocate({ goalId, label }: { goalId: string, label: string }) {
  const { showToast } = useToast();
  const [amount, setAmount] = useState("");
  const { formAction, isPending } = useFormAction(allocateMoney, {
    onSuccess: () => {
      showToast("Ahorro registrado", "success");
      setAmount("");
    }
  });

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="goalId" value={goalId} />
      <div className={styles.input}>
        <Input 
          name="amount" 
          type="number" 
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          placeholder="0.00" 
          required 
        />
      </div>
      <Button type="submit" isLoading={isPending}>{label}</Button>
    </form>
  );
}
