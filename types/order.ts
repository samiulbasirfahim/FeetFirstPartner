export type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    customerId: number;
    price: number;
    status: "pending" | "completed" | "shipped";
    createdAt?: string;
};
