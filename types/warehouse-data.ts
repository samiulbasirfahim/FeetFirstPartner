export type WarehouseData = {
    id?: number;
    label: string;               // e.g. "Orthopädische Einlagen Standard"
    storageLocation: string;     // e.g. "Regal A1"
    supplier: string;            // e.g. "Bayer"
    articleNumber: string;       // e.g. "OE-STD-001"
    stock: Record<number, number>; // e.g. { 20: 5, 37: 12, 42: 8, 45: 15, 50: 3 }
    status?: 'OK' | 'Low';       // optional: "OK" or "Niedriger Bestand"
};
