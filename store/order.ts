import { Order } from "@/types/order";
import { create } from "zustand";
// small helper to subtract days without adding date-fns dependency
const subDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
};

// create sample createdAt values relative to now
const now = new Date();

export const initialOrders: Order[] = [
    {
        id: 1,
        orderNumber: "A001",
        customerName: "Maria Schmidt",
        customerId: 1,
        price: 89.5,
        status: "pending",
        createdAt: now.toISOString(),
    },
    {
        id: 2,
        orderNumber: "A002",
        customerName: "Hans Müller",
        customerId: 2,
        price: 156.8,
        status: "ready",
        createdAt: subDays(now, 1).toISOString(),
    },
    {
        id: 3,
        orderNumber: "A003",
        customerName: "Anna Weber",
        customerId: 3,
        price: 120.4,
        status: "completed",
        createdAt: subDays(now, 2).toISOString(),
    },
    {
        id: 4,
        orderNumber: "A004",
        customerName: "Peter Braun",
        customerId: 4,
        price: 98.9,
        status: "pending",
        createdAt: subDays(now, 4).toISOString(),
    },
    {
        id: 5,
        orderNumber: "A005",
        customerName: "Laura Fischer",
        customerId: 5,
        price: 132.5,
        status: "ready",
        createdAt: subDays(now, 6).toISOString(),
    },
    {
        id: 6,
        orderNumber: "A006",
        customerName: "Michael Schneider",
        customerId: 6,
        price: 178.0,
        status: "completed",
        createdAt: subDays(now, 8).toISOString(),
    },
    {
        id: 7,
        orderNumber: "A007",
        customerName: "Julia Wagner",
        customerId: 7,
        price: 111.7,
        status: "pending",
        createdAt: subDays(now, 10).toISOString(),
    },
    {
        id: 8,
        orderNumber: "A008",
        customerName: "Thomas Becker",
        customerId: 8,
        price: 147.2,
        status: "ready",
        createdAt: subDays(now, 12).toISOString(),
    },
    {
        id: 9,
        orderNumber: "A009",
        customerName: "Sophie Keller",
        customerId: 9,
        price: 95.4,
        status: "completed",
        createdAt: subDays(now, 20).toISOString(),
    },
    {
        id: 10,
        orderNumber: "A010",
        customerName: "Lukas Hoffmann",
        customerId: 10,
        price: 164.8,
        status: "pending",
        createdAt: subDays(now, 25).toISOString(),
    },
    {
        id: 11,
        orderNumber: "A011",
        customerName: "Nina Schulz",
        customerId: 11,
        price: 102.6,
        status: "ready",
        createdAt: subDays(now, 40).toISOString(),
    },
    {
        id: 12,
        orderNumber: "A012",
        customerName: "Markus König",
        customerId: 12,
        price: 138.9,
        status: "completed",
        createdAt: subDays(now, 60).toISOString(),
    },
    {
        id: 13,
        orderNumber: "A013",
        customerName: "Clara Lehmann",
        customerId: 13,
        price: 121.3,
        status: "pending",
        createdAt: subDays(now, 75).toISOString(),
    },
    {
        id: 14,
        orderNumber: "A014",
        customerName: "Jan Richter",
        customerId: 14,
        price: 177.5,
        status: "ready",
        createdAt: subDays(now, 90).toISOString(),
    },
    {
        id: 15,
        orderNumber: "A015",
        customerName: "Lisa Neumann",
        customerId: 15,
        price: 99.9,
        status: "completed",
        createdAt: subDays(now, 120).toISOString(),
    },
];

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
};

export const useOrderStore = create<OrderState>((set, get) => ({
    searchQuery: "",
    initialOrders: initialOrders,
    orders: initialOrders,

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
}));
