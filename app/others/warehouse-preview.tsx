import { RNButton } from "@/components/ui/button";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { useOtherStore } from "@/store/others";
import { Pressable, StyleSheet, View } from "react-native";
import { Portal } from "react-native-portalize";

export function WarehousePreview() {
    const { showWarehousePreview, setWarehousePreview, warehouseForm } =
        useOtherStore();

    return (
        <Portal>
            {showWarehousePreview && (
                <>
                    <Pressable
                        onPress={() => setWarehousePreview(false)}
                        style={styles.container}
                    >
                        <Pressable
                            onPress={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            style={styles.formContainer}
                        >
                            <View style={styles.buttonContainer}>
                                <RNButton
                                    label="Abbrechen"
                                    onPress={() => setWarehousePreview(false)}
                                />
                                <RNButton
                                    label="Abbrechen"
                                    onPress={() => setWarehousePreview(false)}
                                />
                            </View>
                        </Pressable>
                    </Pressable>
                </>
            )}
        </Portal>
    );
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        inset: 0,
        backgroundColor: `${colors.secondary}DD`,
        alignItems: "center",
        justifyContent: "center",
    },
    formContainer: {
        width: "90%",
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 50,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
