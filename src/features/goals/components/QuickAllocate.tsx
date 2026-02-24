"use client";

import { useState } from "react";
import { allocateMoney } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Button, Input, Flex } from "../../../shared/ui";
import { useToast } from "@/contexts";

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
    <form action={formAction}>
      <input type="hidden" name="goalId" value={goalId} />
      <Flex gap={2} align="center">
        <Input 
          name="amount" 
          type="number" 
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
          placeholder="0.00" 
          style={{ width: '80px' }} 
          required 
        />
        <Button type="submit" isLoading={isPending}>{label}</Button>
      </Flex>
    </form>
  );
}
