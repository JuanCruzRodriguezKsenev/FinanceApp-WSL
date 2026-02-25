import { getContacts } from "../actions";
import { Table, Badge } from "../../../shared/ui";
import { Dictionary } from "../../../shared/lib/i18n/types";
import styles from "./ContactList.module.css";

export async function ContactList({ dict }: { dict: Dictionary["contacts"] }) {
  const result = await getContacts();

  if (!result.isOk) {
    return <p>Error loading contacts: {result.error.message}</p>;
  }

  const columns = [
    { key: "name" as const, label: dict.nameLabel },
    { key: "alias" as const, label: dict.aliasLabel, render: (val: string) => val || "-" },
    { 
      key: "methods" as const, 
      label: dict.title, 
      render: (methods: any[]) => (
        <div className={styles.methodsContainer}>
          {methods?.map((m, i) => (
            <Badge key={i} variant="secondary" size="sm">
              {m.type}: {m.value.slice(0, 4)}...
            </Badge>
          )) || "-"}
        </div>
      ) 
    },
  ];

  return (
    <Table 
      data={result.value} 
      columns={columns} 
      emptyMessage={dict.emptyMessage}
    />
  );
}
