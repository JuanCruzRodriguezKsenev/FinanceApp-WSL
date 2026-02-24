import { getTransactions } from "../actions";
import { Table } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export async function TransactionList({ dict }: { dict: Dictionary["transactions"] }) {
  const result = await getTransactions();

  if (!result.isOk) {
    return <p>Error loading transactions: {result.error.message}</p>;
  }

  const columns = [
    { key: "amount" as const, label: dict.tableAmount, render: (val: string) => `$${val}` },
    { key: "cbu" as const, label: dict.tableCbu },
    { key: "status" as const, label: dict.tableStatus },
    { key: "createdAt" as const, label: dict.tableDate, render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage="No transactions yet"
    />
  );
}
