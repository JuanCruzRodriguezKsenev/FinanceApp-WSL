"use client";

import { useState } from "react";
import { createTransaction } from "../actions";
import { useAction } from "../../../shared/hooks/useAction";
import { Flex, Card, Button, Input, Label, Alert } from "../../../shared/ui";

export function TransactionForm({ dict }: { dict: Record<string, string> }) {
  const [formData, setFormData] = useState({ amount: "", cbu: "", description: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const { execute, isExecuting, data, error } = useAction(createTransaction, {
    onSuccess: (data) => {
      setStatusMessage(`${dict.successMessage}: ${data.id}`);
      setFormData({ amount: "", cbu: "", description: "" }); // Reset
    },
    onError: () => {
      setStatusMessage(dict.errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      ...formData,
      amount: formData.amount ? Number(formData.amount) : undefined,
    };
    execute(input);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={4}>
          <div>
            <Label htmlFor="amount">{dict.amountLabel}</Label>
            <Input 
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder={dict.amountPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="cbu">{dict.cbuLabel}</Label>
            <Input 
              id="cbu"
              type="text"
              value={formData.cbu}
              onChange={(e) => setFormData(prev => ({ ...prev, cbu: e.target.value }))}
              placeholder={dict.cbuPlaceholder}
            />
          </div>

          <div>
            <Label htmlFor="description">{dict.descriptionLabel}</Label>
            <Input 
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={dict.descriptionPlaceholder}
            />
          </div>

          <Button 
            type="submit" 
            isLoading={isExecuting}
          >
            {isExecuting ? dict.processingButton : dict.submitButton}
          </Button>
        </Flex>
      </form>

      {/* RESULTADOS O ERRORES */}
      <div style={{ marginTop: "30px" }}>
        {statusMessage && !error && !data && <p style={{ fontWeight: "bold" }}>{statusMessage}</p>}

        {error && (
          <Alert 
            type="error" 
            title={`⚠️ ${dict.errorTitle} (${error.type})`}
            details={error.details?.circuitStatus ? `CIRCUIT_BREAKER_STATE: ${error.details.circuitStatus}` : undefined}
          >
            <p>{error.message}</p>
            {error.type === "VALIDATION_ERROR" && error.field && (
              <small style={{ display: "block", marginTop: "10px" }}>
                {dict.errorFieldAffected}: <b>{error.field}</b>
              </small>
            )}
          </Alert>
        )}
        
        {data && (
          <Alert type="success" title={`✅ ${dict.successCardTitle}`}>
            <pre style={{ margin: 0, fontSize: "0.8em", overflowX: "auto" }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Alert>
        )}
      </div>
    </Card>
  );
}
