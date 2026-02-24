import { getGoals } from "../actions";
import { Table, Badge } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { QuickAllocate } from "./QuickAllocate";

export async function GoalList({ dict }: { dict: Dictionary["goals"] }) {
  const result = await getGoals();

  if (!result.isOk) {
    return <p>Error loading goals: {result.error.message}</p>;
  }

  const columns = [
    { key: "name" as const, label: dict.nameLabel },
    { 
      key: "type" as const, 
      label: dict.typeLabel,
      render: (val: string) => (
        <Badge variant={val === 'GOAL' ? 'info' : 'warning'} size="sm">
          {val}
        </Badge>
      )
    },
    { 
      key: "progress" as const, 
      label: "Progreso",
      render: (_: any, item: any) => {
        const progress = (Number(item.currentAmount) / Number(item.targetAmount)) * 100;
        return (
          <div style={{ width: '120px' }}>
            <div style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
              {item.currency === 'USD' ? 'u$s' : '$'}{item.currentAmount} / {item.targetAmount}
            </div>
            <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: 'var(--color-primary)', transition: 'width 0.3s' }} />
            </div>
          </div>
        );
      }
    },
    {
      key: "id" as const,
      label: "Acción",
      render: (id: string) => <QuickAllocate goalId={id} label={dict.allocateButton} />
    }
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage={dict.emptyMessage}
    />
  );
}
