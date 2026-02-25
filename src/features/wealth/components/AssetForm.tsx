"use client";

import { useEffect } from "react";
import { createAsset } from "../actions";
import { useFormAction } from "../../../shared/hooks/useFormAction";
import { Card, Input, Form, Select } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { useToast } from "@/contexts";
import styles from "./WealthForms.module.css";

export function AssetForm({ dict }: { dict: Dictionary["wealth"] }) {
  const { showToast } = useToast();
  const { formAction, state } = useFormAction(createAsset, {
    onSuccess: () => showToast(dict.successAsset, "success")
  });

  useEffect(() => {
    if (state?.isErr) showToast(state.error.message, "error");
  }, [state, showToast]);

  return (
    <Card>
      <h3>{dict.assetsTitle}</h3>
      <Form action={formAction} submitLabel={dict.submitAsset} error={state?.isErr ? state.error : null}>
        <Input name="name" label={dict.assetName} required />
        
        <div className={styles.row}>
          <div className={styles.col2}>
            <Select name="type" label={dict.assetType} required>
              <option value="REAL_ESTATE">{dict.types.REAL_ESTATE}</option>
              <option value="STOCKS">{dict.types.STOCKS}</option>
              <option value="CRYPTO">{dict.types.CRYPTO}</option>
              <option value="CASH">{dict.types.CASH}</option>
              <option value="OTHER">{dict.types.OTHER}</option>
            </Select>
          </div>
          <div className={styles.col1}>
            <Input name="tickerSymbol" label={dict.assetTicker} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col2}>
            <Input name="value" type="number" label={dict.assetValue} required />
          </div>
          <div className={styles.col1}>
            <Select name="currency" label={dict.assetCurrency}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </Select>
          </div>
        </div>
      </Form>
    </Card>
  );
}
