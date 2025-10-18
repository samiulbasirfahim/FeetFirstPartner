import { QRCodeResponse } from "@/lib/handleQrCode";
import { Order } from "@/types/order";
import { create } from "zustand";
const subDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
};

const now = new Date();

export const initialOrders: Order[] = [];

export enum DateRange {
    All = "ALL",
    ThreeDays = "THREE_DAYS",
    Week = "WEEK",
    Month = "MONTH",
}

type OrderState = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    initialOrders: Order[];
    orders: Order[];
    setOrders: (data: Order[]) => void;
    filterByRange: (range: DateRange) => void;
    filterByStatus: (status: Order["status"] | "all") => void;
    addOrder: (item: Order) => void;
    updateOrder: (item: Order) => void;
    removeOrder: (id: number) => void;
    tmpData: QRCodeResponse | null;
    setTmpData: (data: QRCodeResponse | null) => void;
    getOrderById: (id: number) => Order | undefined;
};

export const useOrderStore = create<OrderState>((set, get) => ({
    searchQuery: "",
    initialOrders: initialOrders,
    orders: initialOrders,
    tmpData: null,
    setTmpData: (data) => set(() => ({ tmpData: data })),

    setOrders: (data) => set(() => ({ initialOrders: data, orders: data })),

    filterByStatus: (status) => {
        if (status === "all") {
            set({ orders: get().initialOrders });
            return;
        }

        const filtered = get().initialOrders.filter((o) => o.status === status);
        set({ orders: filtered });
    },

    filterByRange: (range: DateRange) => {
        if (range === DateRange.All) {
            set({ orders: get().initialOrders });
            return;
        }

        const now = new Date();
        let cutoff: Date;
        if (range === DateRange.ThreeDays) {
            cutoff = subDays(now, 3);
        } else if (range === DateRange.Week) {
            cutoff = subDays(now, 7);
        } else {
            cutoff = subDays(now, 30);
        }

        const filtered = get().initialOrders.filter((o) => {
            if (!o.createdAt) return false;
            const created = new Date(o.createdAt);
            return created >= cutoff && created <= now;
        });

        set({ orders: filtered });
    },

    addOrder: (item) =>
        set((state) => {
            const next = [
                ...state.initialOrders,
                { ...item, id: item.id ?? Date.now() },
            ];
            return { initialOrders: next, orders: next };
        }),

    updateOrder: (updatedItem) =>
        set((state) => {
            const next = state.initialOrders.map((o) =>
                o.id === updatedItem.id ? updatedItem : o,
            );
            return { initialOrders: next, orders: next };
        }),

    removeOrder: (id) =>
        set((state) => {
            const next = state.initialOrders.filter((o) => o.id !== id);
            return { initialOrders: next, orders: next };
        }),

    setSearchQuery: (query) => {
        const q = query.toLowerCase();
        const filtered = get().initialOrders.filter(
            (o) =>
                o.orderNumber.toLowerCase().includes(q) ||
                o.customerName.toLowerCase().includes(q) ||
                o.status.toLowerCase().includes(q),
        );
        set({ orders: filtered, searchQuery: query });
    },

    getOrderById: (id) => get().initialOrders.find((o) => o.id === id),
}));
