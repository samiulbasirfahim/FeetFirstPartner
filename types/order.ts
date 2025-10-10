export type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    customerId: number;
    price: number;
    status: "pending" | "completed" | "ready";
    /** ISO date string when the order was created/placed */
    createdAt?: string;
};
