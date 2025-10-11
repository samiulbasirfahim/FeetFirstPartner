import { colors } from "@/constants/colors";
import { useCustomerStore } from "@/store/customer";
import { Calendar, ShoppingBag } from "lucide-react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { RNButton } from "../ui/button";
import RNText from "../ui/text";

export function CustomerDataList() {
    const { customers } = useCustomerStore();

    const renderItem = ({ item }: { item: (typeof customers)[0] }) => {
        return (
            <View style={styles.renderItemcontainer}>
                <View style={styles.labelContainer}>
                    <RNText
                        style={{
                            maxWidth: "60%",
                            fontWeight: "500",
                            fontSize: 16,
                        }}
                    >
                        {item.fullName}
                    </RNText>
                    <View style={{ flexShrink: 0 }}>
                        {item.orderStatus === "ready" && (
                            <RNButton label="Abholbereit" variant="primary" size="xs" />
                        )}

                        {item.orderStatus === "pending" && (
                            <RNButton label="Ausstehend" variant="outline" size="xs" />
                        )}

                        {item.orderStatus === "completed" && (
                            <RNButton label="Abgeschlossen" variant="outline" size="xs" />
                        )}
                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Calendar size={16} color={colors.muted} />
                    <RNText style={{ color: colors.muted }}>{item.dateOfBirth}</RNText>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <ShoppingBag size={16} color={colors.muted} />
                    <RNText style={{ color: colors.muted }}>
                        Letzer Auftrag:
                        {item.lastOrderDate}
                    </RNText>
                </View>

                <RNText>{item.contact}</RNText>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={customers}
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
});
