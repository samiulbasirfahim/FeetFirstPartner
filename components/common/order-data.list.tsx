import { colors } from "@/constants/colors";
import { useOrderStore } from "@/store/order";
import {
    Calendar,
    DollarSign,
    EuroIcon,
    ShoppingBag,
    Users2,
} from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { RNButton } from "../ui/button";
import RNText from "../ui/text";

export function OrderDataList() {
    const { orders } = useOrderStore();

    console.log(orders);
    const handleCreateOrder = () => {
        console.log(orders);
    };

    const renderItem = ({ item }: { item: (typeof orders)[0] }) => {
        return (
            <View style={styles.renderItemcontainer}>
                <View style={styles.labelContainer}>
                    <RNText style={{ fontWeight: "500", fontSize: 16 }}>
                        Auftrag {item.orderNumber}
                    </RNText>
                    <View style={{ flexShrink: 0 }}>
                        {item.status === "ready" && (
                            <RNButton label="Abholbereit" variant="primary" size="xs" />
                        )}

                        {item.status === "pending" && (
                            <RNButton label="Ausstehend" variant="outline" size="xs" />
                        )}

                        {item.status === "completed" && (
                            <RNButton label="Abgeschlossen" variant="outline" size="xs" />
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    {
                        // <Users2 size={16} color={colors.muted} />
                    }
                    <RNText style={{ color: colors.muted }}>{item.customerName}</RNText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <RNText style={{ color: colors.muted }}>
                        {item.price.toFixed(2)}
                    </RNText>

                    <EuroIcon size={16} color={colors.muted} />
                </View>
            </View>
        );
    };

    if (!orders || orders.length === 0) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <RNText style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
                    Keine Aufträge gefunden
                </RNText>
                <RNText style={{ color: colors.muted, marginBottom: 16 }}>
                    Erstellen Sie einen neuen Auftrag, um loszulegen.
                </RNText>
                <View style={styles.buttonContainer}>
                    <RNButton label="Create Order" onPress={handleCreateOrder} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                contentContainerStyle={{ paddingVertical: 12 }}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
    },
    renderItemcontainer: {
        padding: 10,
        gap: 4,
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
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        borderRadius: 8,
    },
});
