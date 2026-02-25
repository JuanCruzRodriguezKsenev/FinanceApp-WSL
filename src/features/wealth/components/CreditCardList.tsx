import { getWealthData } from "../actions";
import { Table, Badge } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";

export async function CreditCardList({ dict }: { dict: Dictionary["wealth"] }) {
  const result = await getWealthData();

  if (!result.isOk) {
    return <p>Error loading credit cards: {result.error.message}</p>;
  }

  const { creditCards } = result.value;

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
    <Table 
      data={creditCards} 
      columns={cardColumns} 
      emptyMessage="No credit cards registered" 
      filterable
      filterPlaceholder="Buscar tarjeta..."
    />
  );
}
