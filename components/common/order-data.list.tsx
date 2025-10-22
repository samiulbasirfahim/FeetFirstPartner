import { colors } from "@/constants/colors";
import { Swipeable } from "react-native-gesture-handler";
import { notify } from "@/lib/notify";
import { useOrderStore } from "@/store/order";
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Camera, EuroIcon, Trash } from "lucide-react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { RNButton } from "../ui/button";
import RNText from "../ui/text";

export function OrderDataList() {
    const { orders, removeOrder } = useOrderStore();
    const [permission, requestPermission] = useCameraPermissions();

    function handleDeleteOrder(id: number) {
        removeOrder(id);
        notify({
            type: "success",
            title: "Auftrag gelöscht",
            message: "Der Auftrag wurde erfolgreich gelöscht.",
        });
    }

    const handleCreateOrder = async (
        status: "pending" | "completed" | "shipped",
    ) => {
        if (permission?.granted === false) {
            const permission = await requestPermission();
            if (!permission.granted) {
                notify({
                    type: "error",
                    title: "Berechtigung verweigert",
                    message:
                        "Kameraberechtigung ist erforderlich, um Artikel zu scannen.",
                });
                return;
            }
        }

        router.push({
            pathname: "/others/qr-code-scanner",
            params: { status },
        });
    };

    const RenderItem = ({ item }: { item: (typeof orders)[0] }) => {
        return (
            <View style={styles.renderItemcontainer}>
                <View style={styles.labelContainer}>
                    <RNText style={{ fontWeight: "500", fontSize: 16 }}>
                        Auftrag {item.orderNumber}
                    </RNText>

                    <View style={{ flexShrink: 0 }}>
                        {item.status === "shipped" && (
                            <RNButton label="Erledigt" variant="outline" size="xs" />
                        )}

                        {item.status === "completed" && (
                            <RNButton label="Abholbereit" variant="green" size="xs" />
                        )}

                        {item.status === "pending" && (
                            <RNButton label="In Fertigung" variant="primary" size="xs" />
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

    const HeaderComponent = () => {
        return (
            <View style={{ gap: 6, paddingBottom: 12 }}>
                <RNButton
                    onPress={() => handleCreateOrder("pending")}
                    icon={Camera}
                    label="Einlage in Fertigung"
                    size="md"
                />
                <RNButton
                    onPress={() => handleCreateOrder("completed")}
                    style={{ backgroundColor: colors.accent }}
                    variant="primary"
                    icon={Camera}
                    label="Einlage abholbereit"
                    size="md"
                />
                <RNButton
                    onPress={() => handleCreateOrder("shipped")}
                    variant="outline"
                    icon={Camera}
                    label="Einlage ausführen"
                    size="md"
                />
            </View>
        );
    };

    if (!orders || orders.length === 0) {
        return (
            <View style={{ ...styles.container, paddingVertical: 12 }}>
                <HeaderComponent />
                <View style={[styles.container, styles.emptyContainer]}>
                    <RNText
                        style={{
                            fontSize: 18,
                            fontWeight: "600",
                            marginBottom: 8,
                            textAlign: "center",
                        }}
                    >
                        Keine Aufträge gefunden
                    </RNText>
                    <RNText
                        style={{
                            color: colors.muted,
                            marginBottom: 16,
                            textAlign: "center",
                        }}
                    >
                        Erstellen Sie einen neuen Auftrag, um loszulegen.
                    </RNText>
                </View>
            </View>
        );
    }

    const renderAction = ({ id }: { id: number }) => {
        return (
            <View style={{ justifyContent: "center", height: "100%" }}>
                <TouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                    }}
                    activeOpacity={0.7}
                    onPress={() => {
                        handleDeleteOrder(id);
                    }}
                >
                    <Trash size={24} color={colors.error} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={HeaderComponent}
                data={orders}
                contentContainerStyle={{ paddingVertical: 12 }}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => {
                    if (item.status === "shipped") {
                        return (
                            <Swipeable
                                renderRightActions={() => renderAction({ id: item.id })}
                                containerStyle={{
                                    borderRadius: 8,
                                    backgroundColor: colors.border,
                                }}
                            >
                                <RenderItem item={item} />
                            </Swipeable>
                        );
                    }
                    return <RenderItem item={item} />;
                }}
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
