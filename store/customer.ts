import { Customer, CustomerFull } from "@/types/customer";
import { create } from "zustand";

const initialCustomerFullData: CustomerFull[] = [
    {
        id: 1,
        gender: "man",
        firstName: "Aiden",
        lastName: "Brooks",
        email: "aiden.brooks@example.com",
        address: "123 Main St, 85386 Eching",
        dateOfBirth: "1987-03-12",
        insuranceNumber: "Z411008593",
        statusCode: "100000",
        dateOfPrescription: "2025-10-10",

        healthInsuranceProvider: "AOK Bayern",
        healthInsuranceProviderId: "108380007",
        clinicId: "644417400",
        prescribingDoctor: "Dr. med. Alexander Dittmar",
        clinicAddress: "Terminalstraße Mitte 18, 85356 München Flughafen",
        physicianId: "732269410",

        medicalDiagnosis: "Knick-Senk-Spreizfuß bds., Achillodynie li.",
        typeOfPrescription:
            "2 Paar Weichpolsterbettungseinlagen + Fersenweichpolsterung 2x nach Formabdruck; Quer & Längsgewölbeunterstützung bds.",
        importanceType: "",
    },
    {
        id: 2,
        gender: "woman",
        firstName: "Sophia",
        lastName: "Martinez",
        email: "sophia.martinez@example.com",
        address: "Daitenhausener Str. 10, 85386 Eching",
        dateOfBirth: "1992-08-24",
        insuranceNumber: "Z411008594",
        statusCode: "100001",
        dateOfPrescription: "2025-09-29",

        healthInsuranceProvider: "BARMER",
        healthInsuranceProviderId: "108380008",
        clinicId: "644417401",
        prescribingDoctor: "Dr. med. Laura Stein",
        clinicAddress: "Bahnhofstraße 22, 80335 München",
        physicianId: "732269411",

        medicalDiagnosis: "Plantarfasziitis rechts",
        typeOfPrescription:
            "1 Paar Gel-Soft-Einlagen mit zusätzlicher Fersenweichpolsterung nach Formabdruck.",

        importanceType: "",
    },
];

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
    getCustomerById: (id: number) => Customer | undefined;
    addCustomer: (item: Customer) => void;
    updateCustomer: (item: Customer) => void;
    removeCustomer: (id: number) => void;

    isLoading: boolean;
    tmpData: CustomerFull | null;
    setIsLoading: (loading: boolean) => void;
    setTmpData: (data: CustomerFull | null) => void;

    customerFullData: CustomerFull[];
    addCustomerFullData: (data: CustomerFull) => void;
    getCustomerFullDataById: (id: number) => CustomerFull | undefined;
};

export const useCustomerStore = create<CustomerState>((set, get) => ({
    searchQuery: "",
    initialCustomers: initialCustomerData,
    customers: initialCustomerData,
    isLoading: false,
    tmpData: null,

    customerFullData: initialCustomerFullData,

    addCustomerFullData: (data: CustomerFull) =>
        set((state) => ({
            customerFullData: [
                ...state.customerFullData,
                { ...data, id: data.id ?? Date.now() },
            ],
        })),

    getCustomerFullDataById: (id: number) =>
        get().customerFullData.find((c) => c.id === id),

    setIsLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
    setTmpData: (data: CustomerFull | null) => set(() => ({ tmpData: data })),

    setCustomers: (data: Customer[]) =>
        set(() => ({ initialCustomers: data, customers: data })),

    getCustomerById: (id: number) =>
        get().initialCustomers.find((c) => c.id === id),

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
