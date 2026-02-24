import { getBankAccounts } from "../actions";
import { Table } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export async function BankAccountList({ dict }: { dict: Dictionary["bankAccounts"] }) {
  const result = await getBankAccounts();

  if (!result.isOk) {
    return <p>Error loading bank accounts: {result.error.message}</p>;
  }

  const columns = [
    { key: "alias" as const, label: dict.tableAlias },
    { key: "bankName" as const, label: dict.tableBank },
    { key: "cbu" as const, label: dict.cbuLabel },
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage="No bank accounts added"
    />
  );
}
