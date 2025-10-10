import { WarehouseData } from "@/types/warehouse-data";
import { create } from "zustand";

const initialWarehouseData: WarehouseData[] = [
    {
        id: 1,
        label: "Orthopädische Einlagen Standard",
        storageLocation: "Regal A1",
        supplier: "Bayer",
        articleNumber: "OE-STD-001",
        stock: { 20: 5, 37: 12, 42: 8, 45: 15, 50: 3 },
        status: "OK",
    },
    {
        id: 2,
        label: "Sport Einlagen Premium",
        storageLocation: "Regal B2",
        supplier: "Scholl",
        articleNumber: "SE-PRM-002",
        stock: { 20: 1, 37: 2, 42: 0, 45: 4, 50: 1 },
        status: "Low",
    },
    {
        id: 3,
        label: "Diabetes Einlagen Spezial",
        storageLocation: "Regal C1",
        supplier: "Footpower",
        articleNumber: "DE-SPZ-003",
        stock: { 38: 7, 40: 11, 43: 6, 46: 9 },
        status: "OK",
    },
    {
        id: 4,
        label: "Gel Komfort Einlagen",
        storageLocation: "Regal D3",
        supplier: "ComfyStep",
        articleNumber: "GC-ENL-004",
        stock: { 36: 10, 38: 5, 40: 2, 42: 0, 44: 8 },
        status: "Low",
    },
    {
        id: 5,
        label: "WorkSafe Einlagen Heavy Duty",
        storageLocation: "Regal E4",
        supplier: "SafeFoot",
        articleNumber: "WF-HD-005",
        stock: { 39: 14, 41: 10, 43: 12, 45: 7 },
        status: "OK",
    },
    {
        id: 6,
        label: "Komfort Leder Einlagen Classic",
        storageLocation: "Regal F1",
        supplier: "Bayer",
        articleNumber: "KL-CLS-006",
        stock: { 36: 8, 38: 9, 40: 4, 42: 6 },
        status: "OK",
    },
    {
        id: 7,
        label: "Sport AirFlex Einlagen",
        storageLocation: "Regal B3",
        supplier: "Scholl",
        articleNumber: "SA-FLX-007",
        stock: { 37: 3, 39: 2, 41: 5, 43: 0 },
        status: "Low",
    },
    {
        id: 8,
        label: "Winter Warm Einlagen",
        storageLocation: "Regal G2",
        supplier: "FootComfort",
        articleNumber: "WW-ENL-008",
        stock: { 36: 12, 38: 9, 40: 14, 42: 10 },
        status: "OK",
    },
    {
        id: 9,
        label: "Arbeit Einlagen Extra Grip",
        storageLocation: "Regal E2",
        supplier: "SafeFoot",
        articleNumber: "AE-GRP-009",
        stock: { 39: 4, 41: 2, 43: 0, 45: 1 },
        status: "Low",
    },
    {
        id: 10,
        label: "Kinder Einlagen SoftStep",
        storageLocation: "Regal H1",
        supplier: "TinyFeet",
        articleNumber: "KE-SFT-010",
        stock: { 28: 10, 30: 7, 32: 12, 34: 9 },
        status: "OK",
    },
    {
        id: 11,
        label: "Memory Foam Einlagen Relax",
        storageLocation: "Regal D2",
        supplier: "ComfyStep",
        articleNumber: "MF-RLX-011",
        stock: { 37: 5, 39: 6, 41: 8, 43: 3 },
        status: "OK",
    },
    {
        id: 12,
        label: "Outdoor Trek Einlagen",
        storageLocation: "Regal J3",
        supplier: "TrailMax",
        articleNumber: "OT-TRK-012",
        stock: { 39: 1, 41: 0, 43: 2, 45: 0 },
        status: "Low",
    },
    {
        id: 13,
        label: "High Arch Einlagen Support",
        storageLocation: "Regal C3",
        supplier: "Footpower",
        articleNumber: "HA-SPT-013",
        stock: { 37: 11, 39: 9, 41: 10, 43: 6 },
        status: "OK",
    },
    {
        id: 14,
        label: "Eco Bamboo Einlagen",
        storageLocation: "Regal K1",
        supplier: "GreenStep",
        articleNumber: "EB-ENL-014",
        stock: { 36: 3, 38: 2, 40: 1, 42: 0 },
        status: "Low",
    },
    {
        id: 15,
        label: "Business Leder Einlagen Premium",
        storageLocation: "Regal L2",
        supplier: "ElegantFeet",
        articleNumber: "BL-PRM-015",
        stock: { 40: 14, 42: 12, 44: 7, 46: 10 },
        status: "OK",
    },
    {
        id: 16,
        label: "Sport Pro Runner Einlagen",
        storageLocation: "Regal M3",
        supplier: "Scholl",
        articleNumber: "SP-RUN-016",
        stock: { 38: 3, 40: 2, 42: 4, 44: 1 },
        status: "Low",
    },
    {
        id: 17,
        label: "Diabetes Komfort Einlagen",
        storageLocation: "Regal N2",
        supplier: "Footpower",
        articleNumber: "DK-ENL-017",
        stock: { 38: 8, 40: 9, 42: 5, 44: 7 },
        status: "OK",
    },
    {
        id: 18,
        label: "Arthritis Soft Gel Einlagen",
        storageLocation: "Regal O1",
        supplier: "ComfyStep",
        articleNumber: "AS-GEL-018",
        stock: { 37: 2, 39: 1, 41: 0, 43: 0 },
        status: "Low",
    },
    {
        id: 19,
        label: "Thermo Warm Einlagen Plus",
        storageLocation: "Regal P2",
        supplier: "WarmFeet",
        articleNumber: "TW-PLS-019",
        stock: { 36: 7, 38: 10, 40: 8, 42: 12 },
        status: "OK",
    },
    {
        id: 20,
        label: "Gel Balance Einlagen",
        storageLocation: "Regal Q1",
        supplier: "BalanceFit",
        articleNumber: "GB-ENL-020",
        stock: { 38: 5, 40: 3, 42: 2, 44: 1 },
        status: "Low",
    },
    {
        id: 21,
        label: "Komfort Everyday Einlagen",
        storageLocation: "Regal R2",
        supplier: "DailyWalk",
        articleNumber: "KE-ENL-021",
        stock: { 36: 15, 38: 13, 40: 9, 42: 10 },
        status: "OK",
    },
    {
        id: 22,
        label: "Sport Lite Einlagen Air",
        storageLocation: "Regal S3",
        supplier: "Scholl",
        articleNumber: "SL-AIR-022",
        stock: { 37: 1, 39: 0, 41: 2, 43: 0 },
        status: "Low",
    },
    {
        id: 23,
        label: "Work Pro Einlagen Safety",
        storageLocation: "Regal T1",
        supplier: "SafeFoot",
        articleNumber: "WP-SAF-023",
        stock: { 39: 10, 41: 7, 43: 9, 45: 11 },
        status: "OK",
    },
    {
        id: 24,
        label: "Kinder Active Einlagen",
        storageLocation: "Regal H2",
        supplier: "TinyFeet",
        articleNumber: "KA-ENL-024",
        stock: { 28: 6, 30: 9, 32: 5, 34: 7 },
        status: "OK",
    },
    {
        id: 25,
        label: "Relax Memory Einlagen Deluxe",
        storageLocation: "Regal D4",
        supplier: "ComfyStep",
        articleNumber: "RM-DLX-025",
        stock: { 38: 2, 40: 1, 42: 0, 44: 0 },
        status: "Low",
    },
];

type WarehouseState = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    initialWarehouseData: WarehouseData[];
    warehouseData: WarehouseData[];
    setWarehouseData: (data: WarehouseData[]) => void;
    addWarehouseItem: (item: WarehouseData) => void;
    updateWarehouseItem: (item: WarehouseData) => void;
    removeWarehouseItem: (id: number) => void;
};

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
    searchQuery: "",
    initialWarehouseData: initialWarehouseData,
    warehouseData: initialWarehouseData,
    setWarehouseData: (data: WarehouseData[]) =>
        set(() => ({ initialWarehouseData: data, warehouseData: data })),
    addWarehouseItem: (item: WarehouseData) =>
        set((state) => {
            const nextInitial = [...state.initialWarehouseData, item];
            return { initialWarehouseData: nextInitial, warehouseData: nextInitial };
        }),
    updateWarehouseItem: (updatedItem: WarehouseData) =>
        set((state) => {
            const nextInitial = state.initialWarehouseData.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
            );
            return { initialWarehouseData: nextInitial, warehouseData: nextInitial };
        }),
    removeWarehouseItem: (id: number) =>
        set((state) => {
            const nextInitial = state.initialWarehouseData.filter(
                (item) => item.id !== id,
            );
            return { initialWarehouseData: nextInitial, warehouseData: nextInitial };
        }),

    setSearchQuery: (query: string) => {
        const q = query.toLowerCase();
        const filteredData = (get().initialWarehouseData || []).filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                item.articleNumber.toLowerCase().includes(q) ||
                item.supplier.toLowerCase().includes(q),
        );
        set({ warehouseData: filteredData, searchQuery: query });
    },
}));
