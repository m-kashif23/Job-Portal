export interface JobPayment {
  id?: number;
  modeOfPayment: string;
  cardHolderName: string;
  totalAmount: number;
  paymentDate?: string;
  status?: string;
}
