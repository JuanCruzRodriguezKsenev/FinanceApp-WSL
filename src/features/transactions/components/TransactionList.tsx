import { getTransactions } from "../actions";
import { Table } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import styles from "./TransactionList.module.css";

export async function TransactionList({ dict }: { dict: Dictionary["transactions"] }) {
  const result = await getTransactions();

  if (!result.isOk) {
    return <p>Error loading transactions: {result.error.message}</p>;
  }

  const columns = [
    { key: "amount" as const, label: dict.tableAmount, render: (val: string, item: any) => `${item.currency === 'USD' ? 'u$s' : '$'}${val}` },
    { 
      key: "cbu" as const, 
      label: dict.tableCbu,
      render: (val: string, item: any) => (
        <div>
          {item.contact ? (
            <div className={styles.contactName}>{item.contact.name}</div>
          ) : null}
          <div className={styles.accountValue}>{val}</div>
        </div>
      )
    },
    { 
      key: "status" as const, 
      label: dict.tableStatus, 
      render: (val: string) => {
        switch (val) {
          case "completed": return dict.statusCompleted;
          case "pending": return dict.statusPending;
          case "failed": return dict.statusFailed;
          default: return val;
        }
      } 
    },
    { key: "createdAt" as const, label: dict.tableDate, render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage="No transactions yet"
      filterable
      filterPlaceholder="Filtrar transacciones..."
    />
  );
}
