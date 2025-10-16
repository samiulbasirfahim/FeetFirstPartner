import { Customer, CustomerFull } from "@/types/customer";
import { create } from "zustand";

// const initialCustomerData: Customer[] = [
//     {
//         id: 1,
//         fullName: "Maria Schmidt",
//         dateOfBirth: "1975-03-15",
//         lastOrderDate: "2025-09-29",
//         contact: "maria.schmidt@email.de",
//         orderStatus: "ready",
//     },
//     {
//         id: 2,
//         fullName: "Hans Müller",
//         dateOfBirth: "1968-07-22",
//         lastOrderDate: "2025-09-28",
//         contact: "+49 30 12345678",
//         orderStatus: "pending",
//     },
//     {
//         id: 3,
//         fullName: "Anna Weber",
//         dateOfBirth: "1982-10-11",
//         lastOrderDate: "2025-09-25",
//         contact: "anna.weber@email.de",
//         orderStatus: "completed",
//     },
//     {
//         id: 4,
//         fullName: "Peter Braun",
//         dateOfBirth: "1990-02-19",
//         lastOrderDate: "2025-09-27",
//         contact: "+49 172 556677",
//         orderStatus: "ready",
//     },
//     {
//         id: 5,
//         fullName: "Laura Fischer",
//         dateOfBirth: "1987-08-09",
//         lastOrderDate: "2025-09-26",
//         contact: "laura.fischer@email.de",
//         orderStatus: "pending",
//     },
//     {
//         id: 6,
//         fullName: "Michael Schneider",
//         dateOfBirth: "1979-12-12",
//         lastOrderDate: "2025-09-24",
//         contact: "+49 40 987654",
//         orderStatus: "completed",
//     },
//     {
//         id: 7,
//         fullName: "Julia Wagner",
//         dateOfBirth: "1995-06-18",
//         lastOrderDate: "2025-09-23",
//         contact: "julia.wagner@email.de",
//         orderStatus: "pending",
//     },
//     {
//         id: 8,
//         fullName: "Thomas Becker",
//         dateOfBirth: "1983-11-05",
//         lastOrderDate: "2025-09-21",
//         contact: "+49 89 445566",
//         orderStatus: "ready",
//     },
//     {
//         id: 9,
//         fullName: "Sophie Keller",
//         dateOfBirth: "1992-04-14",
//         lastOrderDate: "2025-09-20",
//         contact: "sophie.keller@email.de",
//         orderStatus: "completed",
//     },
//     {
//         id: 10,
//         fullName: "Lukas Hoffmann",
//         dateOfBirth: "1988-01-30",
//         lastOrderDate: "2025-09-19",
//         contact: "+49 152 778899",
//         orderStatus: "pending",
//     },
//     {
//         id: 11,
//         fullName: "Nina Schulz",
//         dateOfBirth: "1997-09-08",
//         lastOrderDate: "2025-09-17",
//         contact: "nina.schulz@email.de",
//         orderStatus: "ready",
//     },
//     {
//         id: 12,
//         fullName: "Markus König",
//         dateOfBirth: "1974-05-11",
//         lastOrderDate: "2025-09-16",
//         contact: "+49 172 334455",
//         orderStatus: "completed",
//     },
//     {
//         id: 13,
//         fullName: "Clara Lehmann",
//         dateOfBirth: "1991-03-02",
//         lastOrderDate: "2025-09-15",
//         contact: "clara.lehmann@email.de",
//         orderStatus: "pending",
//     },
// ];

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
    initialCustomers: [],
    customers: [],
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
