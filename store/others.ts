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
    setOrderForm: (data: Order) => void;
    clearOrderForm: () => void;

    // Customer preview
    showCustomerPreview: boolean;
    enableCustomerPreview: () => void;
    disableCustomerPreview: () => void;
    setCustomerPreview: (value: boolean) => void;
    customerForm: Customer | null;
    setCustomerForm: (data: Customer) => void;
    clearCustomerForm: () => void;

    // Warehouse preview
    showWarehousePreview: boolean;
    enableWarehousePreview: () => void;
    disableWarehousePreview: () => void;
    setWarehousePreview: (value: boolean) => void;
    warehouseForm: WarehouseData | null;
    setWarehouseForm: (data: WarehouseData) => void;
    clearWarehouseForm: () => void;
};


export const useOtherStore = create<OtherState>((set) => ({
    // Order
    showOrderPreview: false,
    enableOrderPreview: () => set({ showOrderPreview: true }),
    disableOrderPreview: () => set({ showOrderPreview: false }),
    setOrderPreview: (value: boolean) => set({ showOrderPreview: value }),
    orderForm: null,
    setOrderForm: (data: Order) => set({ orderForm: data }),
    clearOrderForm: () => set({ orderForm: null }),

    // Customer
    showCustomerPreview: false,
    enableCustomerPreview: () => set({ showCustomerPreview: true }),
    disableCustomerPreview: () => set({ showCustomerPreview: false }),
    setCustomerPreview: (value: boolean) => set({ showCustomerPreview: value }),
    customerForm: null,
    setCustomerForm: (data: Customer) => set({ customerForm: data }),
    clearCustomerForm: () => set({ customerForm: null }),

    // Warehouse
    showWarehousePreview: false,
    enableWarehousePreview: () => set({ showWarehousePreview: true }),
    disableWarehousePreview: () => set({ showWarehousePreview: false }),
    setWarehousePreview: (value: boolean) => set({ showWarehousePreview: value }),
    warehouseForm: null,
    setWarehouseForm: (data: WarehouseData) => set({ warehouseForm: data }),
    clearWarehouseForm: () => set({ warehouseForm: null }),
}));
