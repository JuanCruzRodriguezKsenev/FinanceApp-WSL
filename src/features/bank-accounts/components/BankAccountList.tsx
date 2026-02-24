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
    { 
      key: "balance" as const, 
      label: "Balance",
      render: (val: string, item: any) => {
        const total = Number(val);
        const locked = Number(item.locked);
        const available = total - locked;
        const sym = item.currency === 'USD' ? 'u$s' : '$';
        
        return (
          <div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {sym}{available} <small style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>disponible</small>
            </div>
            {locked > 0 && (
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                Total: {sym}{total} (Reserva: {sym}{locked})
              </div>
            )}
          </div>
        );
      }
    },
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
