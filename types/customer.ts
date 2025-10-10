export type Customer = {
    id?: number;
    fullName: string;
    dateOfBirth: string;
    lastOrderDate: string;
    contact: string;
    orderStatus: "ready" | "pending" | "completed";
};
