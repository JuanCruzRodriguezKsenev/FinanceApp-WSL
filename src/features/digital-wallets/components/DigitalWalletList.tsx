import { getDigitalWallets } from "../actions";
import { Table } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export async function DigitalWalletList({ dict }: { dict: Dictionary["digitalWallets"] }) {
  const result = await getDigitalWallets();

  if (!result.isOk) {
    return <p>Error loading digital wallets: {result.error.message}</p>;
  }

  const columns = [
    { key: "provider" as const, label: dict.tableProvider },
    { key: "cvu" as const, label: dict.cvuLabel },
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage="No digital wallets linked"
    />
  );
}
