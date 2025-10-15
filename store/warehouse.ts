import { WarehouseData } from "@/types/warehouse-data";
import { create } from "zustand";

type WarehouseState = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    initialWarehouseData: WarehouseData[];
    warehouseData: WarehouseData[];
    isScanning: boolean;
    setIsScanning: (scanning: boolean) => void;
    tmpData: WarehouseData[] | null;
    setTmpData: (data: WarehouseData[] | null) => void;
    setWarehouseData: (data: WarehouseData[]) => void;
    addWarehouseItem: (item: WarehouseData) => void;
    updateWarehouseItem: (item: WarehouseData) => void;
    removeWarehouseItem: (id: number) => void;
};

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
    searchQuery: "",
    isScanning: false,
    setIsScanning: (scanning: boolean) => set(() => ({ isScanning: scanning })),
    tmpData: [],
    setTmpData: (data: WarehouseData[] | null) => set(() => ({ tmpData: data })),
    initialWarehouseData: [],
    warehouseData: [],
    setWarehouseData: (data: WarehouseData[]) =>
        set(() => ({ initialWarehouseData: data, warehouseData: data })),
    addWarehouseItem: (item: WarehouseData) => {
        const totalStock = item.stock.reduce(
            (sum, entry) => sum + entry.quantity,
            0,
        );
        const newItem: WarehouseData = {
            ...item,
            id: item.id ?? Date.now(),
            status: totalStock > 15 ? "OK" : "Low",
        };
        set((state) => {
            const nextInitial = [...state.initialWarehouseData, newItem];
            return { initialWarehouseData: nextInitial, warehouseData: nextInitial };
        });
    },
    updateWarehouseItem: (updatedItem: WarehouseData) => {
        const totalStock = updatedItem.stock.reduce(
            (sum, entry) => sum + entry.quantity,
            0,
        );
        const newItem: WarehouseData = {
            ...updatedItem,
            status: totalStock > 15 ? "OK" : "Low",
        };
        set((state) => {
            const nextInitial = state.initialWarehouseData.map((item) =>
                item.id === updatedItem.id ? newItem : item,
            );

            return { initialWarehouseData: nextInitial, warehouseData: nextInitial };
        });
    },
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
