import { Customer, CustomerFull } from "@/types/customer";
import { create } from "zustand";

const qr = {
    "customer_id": 1,
    "order_id": 101,
}


const initialCustomerData: Customer[] = [
    {
        id: 1,
        fullName: "Aiden Brooks",
        dateOfBirth: "1987-03-12",
        contact: "aiden.brooks@example.com",
        lastOrderDate: "2025-10-10",
        orderStatus: "completed",
    },
    {
        id: 2,
        fullName: "Sophia Martinez",
        dateOfBirth: "1992-08-24",
        contact: "sophia.martinez@example.com",
        lastOrderDate: "2025-09-29",
        orderStatus: "pending",
    },
];

type CustomerState = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    initialCustomers: Customer[];
    customers: Customer[];
    setCustomers: (data: Customer[]) => void;
    addCustomer: (item: Customer) => void;
    updateCustomer: (item: Customer) => void;
    removeCustomer: (id: number) => void;

    isLoading: boolean;
    tmpData: CustomerFull | null;
    setIsLoading: (loading: boolean) => void;
    setTmpData: (data: CustomerFull | null) => void;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
    searchQuery: "",
    initialCustomers: initialCustomerData,
    customers: initialCustomerData,
    isLoading: false,
    tmpData: null,

    setIsLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
    setTmpData: (data: CustomerFull | null) => set(() => ({ tmpData: data })),

    setCustomers: (data: Customer[]) =>
        set(() => ({ initialCustomers: data, customers: data })),

    addCustomer: (item: Customer) =>
        set((state) => {
            const next = [
                ...state.initialCustomers,
                { ...item, id: item.id ?? Date.now() },
            ];
            return { initialCustomers: next, customers: next };
        }),

    updateCustomer: (updatedItem: Customer) =>
        set((state) => {
            const next = state.initialCustomers.map((c) =>
                c.id === updatedItem.id ? updatedItem : c,
            );
            return { initialCustomers: next, customers: next };
        }),

    removeCustomer: (id: number) =>
        set((state) => {
            const next = state.initialCustomers.filter((c) => c.id !== id);
            return { initialCustomers: next, customers: next };
        }),

    setSearchQuery: (query: string) => {
        const q = query.toLowerCase();
        const filtered = (get().initialCustomers || []).filter(
            (c) =>
                c.fullName.toLowerCase().includes(q) ||
                c.contact.toLowerCase().includes(q) ||
                c.orderStatus.toLowerCase().includes(q),
        );
        set({ customers: filtered, searchQuery: query });
    },
}));
