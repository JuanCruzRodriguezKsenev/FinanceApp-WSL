export interface PaymentCard {
  id: number;
  bank: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holder: string;
  type?: "credit" | "debit";
}

export interface Transaction {
  id: number;
  amount: string;
  cbu: string;
  description?: string | null;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export type Theme = "light" | "dark" | "system";
