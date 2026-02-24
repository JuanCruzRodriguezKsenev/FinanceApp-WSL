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
