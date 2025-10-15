import { colors } from "@/constants/colors";
import { Camera, Search, X } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { RNButton } from "../ui/button";
import RNText from "../ui/text";
import { useWarehouseStore } from "@/store/warehouse";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scanWarehouseData } from "@/lib/scan-warehouse-data";
import { router, usePathname } from "expo-router";

export function WareHouseHeader() {
    const pathname = usePathname();
    const { top } = useSafeAreaInsets();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const { setSearchQuery, isScanning, setIsScanning, setTmpData } =
        useWarehouseStore();

    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    {showSearch ? (
                        <TextInput
                            style={styles.inputField}
                            onChangeText={setSearchQuery}
                            autoFocus
                            placeholder="Suchen..."
                            placeholderTextColor={colors.muted}
                        />
                    ) : (
                        <RNText variant="title">Produktverwaltung</RNText>
                    )}
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.buttonContainerStyle}
                    onPress={() => setShowSearch((prev) => !prev)}
                >
                    {showSearch ? (
                        <X width={20} height={20} />
                    ) : (
                        <Search width={20} height={20} />
                    )}
                </TouchableOpacity>
            </View>
            <RNButton
                onPress={async () => {
                    if (isScanning) return;
                    setIsScanning(true);
                    router.push("/others/warehouse");
                    scanWarehouseData()
                        .then((data) => {
                            setIsScanning(false);
                            if (pathname !== "/others/warehouse") {
                                router.push("/others/warehouse");
                            }
                            console.log("Scanned data:", data);

                            setTmpData(data ?? []);
                        })
                        .catch((error) => {
                            setIsScanning(false);
                            console.error("Error scanning warehouse data:", error);
                        })
                        .finally(() => {
                            setIsScanning(false);
                        });
                }}
                style={{ width: "100%" }}
                label={isScanning ? "Analyzing..." : "Lieferanten scannen"}
                icon={Camera}
                disabled={isScanning}
                variant="primary"
                size="md"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderBottomWidth: 1,
        backgroundColor: colors.background,
        padding: 12,
        borderBottomColor: colors.border,
        paddingBottom: 12,
    },
    header: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    searchContainer: {
        flex: 1,
        height: 40,
        justifyContent: "center",
    },
    buttonContainerStyle: {
        paddingStart: 12,
        paddingVertical: 12,
    },
    inputField: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.border,
        color: colors.foreground,
        paddingStart: 8,
        paddingVertical: 6,
        fontSize: 16,
    },
});
