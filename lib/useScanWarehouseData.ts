import { useOtherStore } from "@/store/others";

export function useWarehousaeDataUpload() {
    const { setWarehousePreview, setWarehouseForm } = useOtherStore();

    async function submit() {
        setWarehouseForm({
            id: 1,
            label: "Warehouse A",
            storageLocation: "Shelf B2",
            supplier: "Supplier X",
            articleNumber: "WH-001",
            stock: { 38: 10, 40: 5, 42: 8, 44: 2 },
            status: "Low",
        });

        setWarehousePreview(true);
    }

    return {
        submit: submit,
    };
}
