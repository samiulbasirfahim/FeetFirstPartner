export type WarehouseData = {
    id?: number;
    label: string;
    storageLocation: string;
    supplier: string;
    articleNumber: string;
    stock: Record<string, number>;
    status?: "OK" | "Low";
};
