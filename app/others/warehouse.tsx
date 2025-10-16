import { LoadingSpinner } from "@/components/common/loading";
import { RNKeyboardAwareScrollView } from "@/components/layout/KeyboardAwareScrollView";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import { RNInput } from "@/components/ui/input";
import { colors } from "@/constants/colors";
import { useWarehouseStore } from "@/store/warehouse";
import { WarehouseData } from "@/types/warehouse-data";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { FastForward, Plus, Save, SkipForward, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function Warehouse() {
    const { isEditing = "false" } = useLocalSearchParams();

    const {
        tmpData,
        isScanning,
        setTmpData,
        addWarehouseItem,
        updateWarehouseItem,
    } = useWarehouseStore();

    const [selected, setSelected] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<WarehouseData | null>(null);

    useEffect(() => {
        if (tmpData && tmpData.length > 0) {
            if (selected >= tmpData.length) {
                setSelected(0);
            }
            setSelectedItem(tmpData[selected]);
        }
    }, [tmpData, selected]);

    if (isScanning) {
        return <LoadingSpinner />;
    }

    function handleNext() {
        if (selectedItem) {
            if (isEditing === "true" && selectedItem.id) {
                updateWarehouseItem(selectedItem);
            } else {
                addWarehouseItem(selectedItem);
            }
        }

        if (selected < (tmpData?.length ?? 1) - 1) {
            setSelected((prev) => prev + 1);
        } else {
            setTmpData([]);
            router.back();
        }
    }

    function handleSkip() {
        if (selected < (tmpData?.length ?? 1) - 1) {
            setSelected((prev) => prev + 1);
        } else {
            setTmpData([]);
            router.back();
        }
    }

    if (!tmpData || tmpData.length === 0) {
        return <Redirect href={"/(tabs)/warehouse"} />;
    }

    return (
        <RNSafeAreaView>
            <RNKeyboardAwareScrollView>
                <View
                    style={{
                        gap: 6,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 12,
                    }}
                >
                    <RNInput
                        label="Article Number"
                        defaultValue={selectedItem?.articleNumber}
                        onChangeText={(text) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, articleNumber: text } : prev,
                            )
                        }
                    />
                    <RNInput
                        label="Label"
                        defaultValue={selectedItem?.label}
                        onChangeText={(text) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, label: text } : prev,
                            )
                        }
                    />
                    <RNInput
                        label="Storage Location"
                        defaultValue={selectedItem?.storageLocation}
                        onChangeText={(text) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, storageLocation: text } : prev,
                            )
                        }
                    />
                    <RNInput
                        label="Supplier"
                        defaultValue={selectedItem?.supplier}
                        onChangeText={(text) =>
                            setSelectedItem((prev) =>
                                prev ? { ...prev, supplier: text } : prev,
                            )
                        }
                    />

                    <View style={{ gap: 6 }}>
                        {selectedItem?.stock &&
                            selectedItem.stock.length > 0 &&
                            selectedItem.stock.map((stockItem, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: "row", gap: 8, flex: 1 }}
                                >
                                    <RNInput
                                        label={index === 0 ? "Key" : ""}
                                        defaultValue={stockItem.key}
                                        onChangeText={(text) => {
                                            if (!selectedItem) return;
                                            const newStock = selectedItem.stock.map((item, i) =>
                                                i === index ? { ...item, key: text } : item,
                                            );
                                            setSelectedItem({ ...selectedItem, stock: newStock });
                                        }}
                                    />
                                    <RNInput
                                        label={index === 0 ? "Quantity" : ""}
                                        defaultValue={stockItem.quantity.toString()}
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            if (!selectedItem) return;
                                            const quantity = parseInt(text) || 0;
                                            const newStock = selectedItem.stock.map((item, i) =>
                                                i === index ? { ...item, quantity: quantity } : item,
                                            );
                                            setSelectedItem({ ...selectedItem, stock: newStock });
                                        }}
                                    />
                                    <View
                                        style={{
                                            justifyContent: "center",
                                            marginTop: index === 0 ? 18 : 0,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newSelectedItem: WarehouseData = {
                                                    ...selectedItem,
                                                    stock: selectedItem.stock.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                };
                                                setSelectedItem(newSelectedItem);
                                            }}
                                        >
                                            <X />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                        <RNButton
                            label="New"
                            size="md"
                            variant="outline"
                            icon={Plus}
                            onPress={() => {
                                if (!selectedItem) return;
                                const newSelectedItem: WarehouseData = {
                                    ...selectedItem,
                                    stock: [...selectedItem.stock, { key: "", quantity: 0 }],
                                };
                                setSelectedItem(newSelectedItem);
                            }}
                        />
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 16,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                        gap: 8,
                    }}
                >
                    <RNButton
                        onPress={handleSkip}
                        variant="outline"
                        label="Überspringen"
                        icon={SkipForward}
                    />
                    <RNButton
                        onPress={handleNext}
                        label={
                            selected < (tmpData?.length ?? 1) - 1 ? "Nächste" : "Speichern"
                        }
                        icon={selected < (tmpData?.length ?? 1) - 1 ? FastForward : Save}
                    />
                </View>
            </RNKeyboardAwareScrollView>
        </RNSafeAreaView>
    );
}
