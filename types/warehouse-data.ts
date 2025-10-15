export type WarehouseData = {
    id?: number;
    label: string;
    storageLocation: string;
    supplier: string;
    articleNumber: string;
    stock: { key: string; quantity: number }[];
    status?: "OK" | "Low";
};
