"use client";

import { useEffect, useState } from "react";
import { createTransaction } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Alert, Form, Select, Flex, RadioGroup } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./TransactionForm.module.css";

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
        <div className={styles.row}>
          <div className={styles.col2}>
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
          <div className={styles.col1}>
            <Select id="currency" name="currency" label={dict.currencyLabel}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </div>

        <Select 
          id="sourceAccountId" 
          name="sourceAccountId" 
          label={dict.sourceAccountLabel}
          value={sourceAccountId}
          onChange={(e) => setSourceAccountId(e.target.value)}
          required
        >
          <option value="">{dict.selectSource}</option>
          {allOwnAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </Select>

        <hr className={styles.divider} />

        <div className={styles.destinationWrapper}>
          <RadioGroup 
            label={dict.destinationLabel}
            name="destinationType"
            value={destinationType}
            onChange={(val) => setDestinationType(val as any)}
            options={[
              { value: "manual", label: dict.destManual },
              { value: "contact", label: dict.destContact },
              { value: "own", label: dict.destOwn }
            ]} 
          />
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
            label={dict.destAccountLabel || "Cuenta Destino"}
            required
          >
            <option value="">{dict.selectDestination || "Seleccionar destino"}</option>
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
              label={dict.selectContactLabel || "Seleccionar Contacto"}
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              required
            >
              <option value="">{dict.searchContact || "Buscar contacto..."}</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.alias ? `(${c.alias})` : ''}</option>
              ))}
            </Select>

            {selectedContact && (
              <Select 
                id="cbu" 
                name="cbu" 
                label={dict.contactAccountLabel || "Cuenta del Contacto"}
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
            <pre className={styles.successData}>
              {JSON.stringify(state.value, null, 2)}
            </pre>
          </Alert>
        )}
      </Form>
    </Card>
  );
}
