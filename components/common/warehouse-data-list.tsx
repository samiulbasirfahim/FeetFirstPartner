import { colors } from "@/constants/colors";
import { useWarehouseStore } from "@/store/warehouse";
import { WarehouseData } from "@/types/warehouse-data";
import { AlertTriangle, CheckCircle, Edit } from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { RNButton } from "../ui/button";
import RNText from "../ui/text";
import { router } from "expo-router";

const RenderItem = ({
    item,
    setTmpData,
}: {
    item: WarehouseData;
    setTmpData: (data: WarehouseData[] | null) => void;
}) => {
    return (
        <View style={renderItemStyles.container}>
            <View style={renderItemStyles.labelContainer}>
                <RNText
                    style={{
                        maxWidth: item.status === "Low" ? "60%" : "70%",
                        fontWeight: "500",
                        fontSize: 16,
                    }}
                >
                    {item.label}
                </RNText>
                <View style={{ flexShrink: 0 }}>
                    <RNButton
                        icon={item.status === "Low" ? AlertTriangle : CheckCircle}
                        label={item.status === "Low" ? "Niedriger Bestand" : "OK"}
                        variant={item.status === "Low" ? "error" : "success"}
                        size="xs"
                    />
                </View>
            </View>
            <RNText variant="caption" style={{ paddingTop: 6 }}>
                {item.storageLocation} • {item.supplier}
            </RNText>

            <RNText variant="caption">Art.-Nr.: {item.articleNumber}</RNText>

            <RNText style={{ paddingVertical: 6 }}>Bestand</RNText>
            {item.stock && item.stock.length > 0 ? (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                    {item.stock.map((stockItem) => (
                        <View key={stockItem.key} style={{ flexDirection: "row", gap: 4 }}>
                            <RNText style={{ color: colors.muted }}>{stockItem.key}:</RNText>
                            <RNText>{stockItem.quantity}</RNText>
                        </View>
                    ))}
                </View>
            ) : (
                <RNText variant="caption" style={{ color: colors.muted }}>
                    Keine Bestandsdaten verfügbar
                </RNText>
            )}
            <View style={renderItemStyles.buttonContainer}>
                <RNButton
                    onPress={() => {
                        setTmpData([item]);
                        router.push({
                            pathname: "/others/warehouse",
                            params: {
                                isEditing: "true",
                            },
                        });
                    }}
                    label="Bearbeiten"
                    icon={Edit}
                    size="sm"
                    variant="outline"
                />
            </View>
        </View>
    );
};

const renderItemStyles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 6,
        paddingTop: 12,
    },
});

export function WarehouseDataList() {
    const { warehouseData } = useWarehouseStore();
    const { setTmpData } = useWarehouseStore();

    return (
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
            {warehouseData.length === 0 ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 12,
                    }}
                >
                    <RNText variant="caption" style={{ textAlign: "center" }}>
                        Keine Produkte gefunden. Bitte fügen Sie Produkte hinzu oder passen
                        Sie Ihre Suchkriterien an.
                    </RNText>
                </View>
            ) : (
                <FlatList
                    data={warehouseData}
                    renderItem={({ item }) => (
                        <RenderItem setTmpData={setTmpData} item={item} />
                    )}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    keyExtractor={(item) => item.id?.toString() || item.articleNumber}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    keyboardDismissMode="interactive"
                />
            )}
        </View>
    );
}
