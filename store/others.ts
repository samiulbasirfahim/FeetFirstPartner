import { Customer } from "@/types/customer";
import { Order } from "@/types/order";
import { WarehouseData } from "@/types/warehouse-data";
import { create } from "zustand";

type OtherState = {
    // Order preview
    showOrderPreview: boolean;
    enableOrderPreview: () => void;
    disableOrderPreview: () => void;
    setOrderPreview: (value: boolean) => void;
    orderForm: Order | null;
    setOrderForm: (data: Order | null) => void;
    updateOrderForm: (data: Partial<Order>) => void;
    clearOrderForm: () => void;

    // Customer preview
    showCustomerPreview: boolean;
    enableCustomerPreview: () => void;
    disableCustomerPreview: () => void;
    setCustomerPreview: (value: boolean) => void;
    customerForm: Customer | null;
    setCustomerForm: (data: Customer | null) => void;
    updateCustomerForm: (data: Partial<Customer>) => void;
    clearCustomerForm: () => void;

    // Warehouse preview
    showWarehousePreview: boolean;
    enableWarehousePreview: () => void;
    disableWarehousePreview: () => void;
    setWarehousePreview: (value: boolean) => void;
    warehouseForm: WarehouseData | null;
    setWarehouseForm: (data: WarehouseData | null) => void;
    updateWarehouseForm: (data: Partial<WarehouseData>) => void;
    clearWarehouseForm: () => void;
};

export const useOtherStore = create<OtherState>((set, get) => ({
    // Order
    showOrderPreview: false,
    enableOrderPreview: () => set({ showOrderPreview: true }),
    disableOrderPreview: () => set({ showOrderPreview: false }),
    setOrderPreview: (value: boolean) => set({ showOrderPreview: value }),
    orderForm: null,
    setOrderForm: (data: Order | null) => set({ orderForm: data }),
    updateOrderForm: (data: Partial<Order>) => {
        const current = get().orderForm;
        if (current) {
            set({ orderForm: { ...current, ...data } });
        }
    },
    clearOrderForm: () => set({ orderForm: null }),

    // Customer
    showCustomerPreview: false,
    enableCustomerPreview: () => set({ showCustomerPreview: true }),
    disableCustomerPreview: () => set({ showCustomerPreview: false }),
    setCustomerPreview: (value: boolean) => set({ showCustomerPreview: value }),
    customerForm: null,
    setCustomerForm: (data: Customer | null) => set({ customerForm: data }),
    updateCustomerForm: (data: Partial<Customer>) => {
        const current = get().customerForm;
        if (current) {
            set({ customerForm: { ...current, ...data } });
        }
    },
    clearCustomerForm: () => set({ customerForm: null }),

    // Warehouse
    showWarehousePreview: false,
    enableWarehousePreview: () => set({ showWarehousePreview: true }),
    disableWarehousePreview: () => set({ showWarehousePreview: false }),
    setWarehousePreview: (value: boolean) => set({ showWarehousePreview: value }),
    warehouseForm: null,
    setWarehouseForm: (data: WarehouseData | null) =>
        set({ warehouseForm: data }),
    updateWarehouseForm: (data: Partial<WarehouseData>) => {
        const current = get().warehouseForm;
        if (current) {
            set({ warehouseForm: { ...current, ...data } });
        }
    },
    clearWarehouseForm: () => set({ warehouseForm: null }),
}));
