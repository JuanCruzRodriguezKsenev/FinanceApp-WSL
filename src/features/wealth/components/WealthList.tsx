import { getWealthData } from "../actions";
import { Table, Badge } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import styles from "./WealthForms.module.css";

export async function WealthList({ dict }: { dict: Dictionary["wealth"] }) {
  const result = await getWealthData();

  if (!result.isOk) {
    return <p>Error loading wealth data: {result.error.message}</p>;
  }

  const { assets, liabilities, creditCards } = result.value;

  const assetColumns = [
    { key: "name" as const, label: dict.assetName },
    { 
      key: "type" as const, 
      label: dict.assetType,
      render: (val: string) => <Badge variant="info" size="sm">{(dict.types as any)[val] || val}</Badge>
    },
    { key: "value" as const, label: dict.assetValue, render: (val: string, item: any) => `${item.currency === 'USD' ? 'u$s' : '$'}${val}` },
  ];

  const liabilityColumns = [
    { key: "name" as const, label: dict.liabilityName },
    { 
      key: "type" as const, 
      label: dict.liabilityType,
      render: (val: string) => <Badge variant="danger" size="sm">{(dict.types as any)[val] || val}</Badge>
    },
    { key: "amount" as const, label: dict.liabilityAmount, render: (val: string, item: any) => `${item.currency === 'USD' ? 'u$s' : '$'}${val}` },
  ];

  const cardColumns = [
    { key: "name" as const, label: dict.cardName },
    { key: "bankName" as const, label: dict.cardBank },
    { key: "limit" as const, label: dict.cardLimit, render: (val: string, item: any) => `${item.currency === 'USD' ? 'u$s' : '$'}${val}` },
    { 
      key: "autoDebit" as const, 
      label: dict.cardAutoDebit,
      render: (val: boolean) => <Badge variant={val ? "success" : "secondary"} size="sm">{val ? "Yes" : "No"}</Badge>
    }
  ];

  return (
    <div className={styles.wealthContainer}>
      <div>
        <h3 className={styles.tableTitle}>{dict.assetsTitle}</h3>
        <Table data={assets} columns={assetColumns} emptyMessage="No assets registered" filterable filterPlaceholder="Buscar activo..." />
      </div>

      <div>
        <h3 className={styles.tableTitle}>{dict.liabilitiesTitle}</h3>
        <Table data={liabilities} columns={liabilityColumns} emptyMessage="No liabilities registered" filterable filterPlaceholder="Buscar deuda..." />
      </div>
    </div>
  );
}
