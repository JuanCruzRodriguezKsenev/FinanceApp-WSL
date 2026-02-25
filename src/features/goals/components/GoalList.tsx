import { getGoals } from "../actions";
import { Table, Badge } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import { QuickAllocate } from "./QuickAllocate";
import styles from "./GoalList.module.css";

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
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>
              {item.currency === 'USD' ? 'u$s' : '$'}{item.currentAmount} / {item.targetAmount}
            </div>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${Math.min(progress, 100)}%` }} 
              />
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
