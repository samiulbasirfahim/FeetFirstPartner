import { colors } from "@/constants/colors";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Portal } from "react-native-portalize";
import RNText from "../ui/text";

export function LoadingSpinner() {
    return (
        <Portal>
            <View style={styles.container}>
                <View>
                    <ActivityIndicator size={24} color={colors.primary} />
                    <RNText
                        style={{
                            fontSize: 22,
                        }}
                        variant="primary"
                    >
                        Analyzing Image...
                    </RNText>
                </View>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
});
