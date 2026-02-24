"use client";

import { useEffect, useState } from "react";
import { createTransaction } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form, Select, Flex } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";

interface Props {
  dict: Dictionary["transactions"];
  accounts: any[];
  wallets: any[];
  contacts: any[];
}

export function TransactionForm({ dict, accounts, wallets, contacts }: Props) {
  const { showToast } = useToast();
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [sourceAccountId, setSourceAccountId] = useState<string>("");
  const [destinationType, setDestinationType] = useState<"manual" | "contact" | "own">("manual");

  const { formAction, state } = useFormAction(createTransaction, {
    onSuccess: (data) => {
      showToast(`${dict.successCardTitle}: ${data.id}`, "success");
    }
  });

  const allOwnAccounts = [
    ...accounts.map(a => ({ id: a.id, name: `${a.bankName} - ${a.alias}`, type: 'account' })),
    ...wallets.map(w => ({ id: w.id, name: w.provider, type: 'wallet' }))
  ];

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  useEffect(() => {
    if (state?.isErr) {
      showToast(state.error.message, "error");
    }
  }, [state, showToast]);

  return (
    <Card>
      <Form 
        action={formAction} 
        submitLabel={dict.submitButton}
        error={state?.isErr ? state.error : null}
      >
        <Flex gap={4}>
          <div style={{ flex: 2 }}>
            <Input 
              id="amount"
              name="amount"
              type="number"
              label={dict.amountLabel}
              placeholder={dict.amountPlaceholder}
              error={state?.isErr && state.error.field === "amount" ? state.error.message : undefined}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select id="currency" name="currency" label="Moneda">
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </Flex>

        <Select 
          id="sourceAccountId" 
          name="sourceAccountId" 
          label="Cuenta Origen"
          value={sourceAccountId}
          onChange={(e) => setSourceAccountId(e.target.value)}
          required
        >
          <option value="">Seleccionar origen</option>
          {allOwnAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </Select>

        <hr style={{ margin: '1rem 0', opacity: 0.1 }} />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Destino
          </label>
          <Flex gap={2}>
            <button 
              type="button" 
              onClick={() => setDestinationType("manual")}
              style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: destinationType === 'manual' ? 'var(--color-primary)' : 'transparent', color: destinationType === 'manual' ? 'white' : 'inherit', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Manual
            </button>
            <button 
              type="button" 
              onClick={() => setDestinationType("contact")}
              style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: destinationType === 'contact' ? 'var(--color-primary)' : 'transparent', color: destinationType === 'contact' ? 'white' : 'inherit', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Contacto
            </button>
            <button 
              type="button" 
              onClick={() => setDestinationType("own")}
              style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: destinationType === 'own' ? 'var(--color-primary)' : 'transparent', color: destinationType === 'own' ? 'white' : 'inherit', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Mis Cuentas
            </button>
          </Flex>
        </div>

        {destinationType === "manual" && (
          <Input 
            id="cbu"
            name="cbu"
            type="text"
            label={dict.cbuLabel}
            placeholder={dict.cbuPlaceholder}
            error={state?.isErr && state.error.field === "cbu" ? state.error.message : undefined}
            required
          />
        )}

        {destinationType === "own" && (
          <Select 
            id="destinationAccountId" 
            name="destinationAccountId" 
            label="Cuenta Destino"
            required
          >
            <option value="">Seleccionar destino</option>
            {allOwnAccounts.filter(acc => acc.id !== sourceAccountId).map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </Select>
        )}

        {destinationType === "contact" && (
          <>
            <Select 
              id="contactId" 
              name="contactId" 
              label="Seleccionar Contacto"
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              required
            >
              <option value="">Buscar contacto...</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.alias ? `(${c.alias})` : ''}</option>
              ))}
            </Select>

            {selectedContact && (
              <Select 
                id="cbu" 
                name="cbu" 
                label="Cuenta del Contacto"
                required
              >
                {selectedContact.methods.map((m: any) => (
                  <option key={m.id} value={m.value}>
                    {m.type}: {m.value} {m.label ? `(${m.label})` : ''}
                  </option>
                ))}
              </Select>
            )}
          </>
        )}

        <Input 
          id="description"
          name="description"
          type="text"
          label={dict.descriptionLabel}
          placeholder={dict.descriptionPlaceholder}
          error={state?.isErr && state.error.field === "description" ? state.error.message : undefined}
        />

        {state?.isOk && (
          <Alert type="success" title={`✅ ${dict.successCardTitle}`}>
            <pre style={{ margin: 0, fontSize: "0.8em", overflowX: "auto" }}>
              {JSON.stringify(state.value, null, 2)}
            </pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
