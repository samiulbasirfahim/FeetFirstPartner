export type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    customerId: number;
    price: number;
    status: "pending" | "completed" | "ready";
    createdAt?: string;
};
