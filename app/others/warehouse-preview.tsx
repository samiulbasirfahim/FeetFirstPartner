import { RNInput } from "@/components/common/input";
import { FloatingFormContainer } from "@/components/layout/FloatingFormContainer";
import { RNButton } from "@/components/ui/button";
import { colors } from "@/constants/colors";
import { useOtherStore } from "@/store/others";
import { WarehouseData } from "@/types/warehouse-data";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StockEntry {
    id: string;
    size: string;
    quantity: number;
}

export function WarehousePreview() {
    const {
        showWarehousePreview,
        setWarehousePreview,
        warehouseForm,
        setWarehouseForm,
    } = useOtherStore();

    const initializeStockEntries = (): StockEntry[] => {
        if (warehouseForm?.stock && Object.keys(warehouseForm.stock).length > 0) {
            return Object.entries(warehouseForm.stock).map(
                ([size, quantity], index) => ({
                    id: `stock-${Date.now()}-${index}`,
                    size,
                    quantity,
                }),
            );
        }
        return [{ id: `stock-${Date.now()}-0`, size: "", quantity: 0 }];
    };

    const [form, setForm] = useState<Omit<WarehouseData, "stock">>({
        label: warehouseForm?.label || "",
        storageLocation: warehouseForm?.storageLocation || "",
        articleNumber: warehouseForm?.articleNumber || "",
        supplier: warehouseForm?.supplier || "",
    });

    const [stockEntries, setStockEntries] = useState<StockEntry[]>(
        initializeStockEntries(),
    );

    // Reset form when modal opens/closes or warehouseForm changes
    useEffect(() => {
        if (showWarehousePreview) {
            // Reset form to default values when modal opens
            setForm({
                label: warehouseForm?.label || "",
                storageLocation: warehouseForm?.storageLocation || "",
                articleNumber: warehouseForm?.articleNumber || "",
                supplier: warehouseForm?.supplier || "",
            });
            setStockEntries(initializeStockEntries());
        }
    }, [showWarehousePreview, warehouseForm]);

    const setValue = (key: keyof Omit<WarehouseData, "stock">, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateStockEntry = (
        id: string,
        field: "size" | "quantity",
        value: string,
    ) => {
        setStockEntries((prev) =>
            prev.map((entry) =>
                entry.id === id
                    ? {
                        ...entry,
                        [field]: field === "quantity" ? parseInt(value) || 0 : value,
                    }
                    : entry,
            ),
        );
    };

    const addNewStockEntry = () => {
        setStockEntries((prev) => [
            ...prev,
            { id: `stock-${Date.now()}`, size: "", quantity: 0 },
        ]);
    };

    const deleteStockEntry = (id: string) => {
        if (stockEntries.length > 1) {
            setStockEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
    };

    const saveForm = () => {
        const stockObject: Record<string, number> = {};
        stockEntries.forEach((entry) => {
            if (entry.size.trim()) {
                stockObject[entry.size] = entry.quantity;
            }
        });

        const completeForm: WarehouseData = {
            ...form,
            stock: stockObject,
        };

        // Save logic - TODO: Implement actual save to database/API
        console.log("Saving warehouse data:", completeForm);

        // Clear the form and close modal after save
        setWarehouseForm(null);
        setWarehousePreview(false);
    };

    const handleClose = () => {
        setWarehousePreview(false);
    };

    return (
        <FloatingFormContainer
            showModal={showWarehousePreview}
            onClose={handleClose}
        >
            <RNInput
                label="Label"
                value={form.label}
                onChangeText={(val) => setValue("label", val)}
            />

            <RNInput
                label="Storage Location"
                value={form.storageLocation}
                onChangeText={(val) => setValue("storageLocation", val)}
            />

            <RNInput
                label="Article Number"
                value={form.articleNumber}
                onChangeText={(val) => setValue("articleNumber", val)}
            />

            <RNInput
                label="Supplier"
                value={form.supplier}
                onChangeText={(val) => setValue("supplier", val)}
            />

            <Text style={styles.sectionTitle}>Stock</Text>

            <View style={{ gap: 8 }}>
                {stockEntries.map((entry, index) => (
                    <View key={entry.id} style={styles.row}>
                        <RNInput
                            value={entry.size}
                            label={index === 0 ? "Size" : undefined}
                            onChangeText={(val) => updateStockEntry(entry.id, "size", val)}
                            style={{ flex: 1 }}
                        />

                        <RNInput
                            label={index === 0 ? "Quantity" : undefined}
                            keyboardType="numeric"
                            value={entry.quantity.toString()}
                            onChangeText={(val) =>
                                updateStockEntry(entry.id, "quantity", val)
                            }
                            style={{ flex: 1 }}
                        />

                        {stockEntries.length > 1 && (
                            <TouchableOpacity
                                onPress={() => deleteStockEntry(entry.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <RNButton
                    size="sm"
                    label="Add New Stock Entry"
                    variant="outline"
                    onPress={addNewStockEntry}
                />
                <RNButton onPress={saveForm} size="sm" label="Save" />
            </View>
        </FloatingFormContainer>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontWeight: "600",
        fontSize: 16,
        marginTop: 12,
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    deleteButtonText: {
        color: colors.primary,
        fontSize: 18,
        fontWeight: "600",
    },
});
