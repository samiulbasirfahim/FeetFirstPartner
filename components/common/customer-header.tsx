import { StyleSheet, View } from "react-native";
import RNText from "../ui/text";
import { colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";

export function CustomerHeader() {
    const { top } = useSafeAreaInsets();
    return (
        <>
            <View style={[styles.container, { paddingTop: top }]}>
                <RNText variant="title">Kunden</RNText>
                <TextInput
                    style={styles.inputField}
                    placeholder="Suchen..."
                    placeholderTextColor={colors.muted}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.white,
        padding: 12,
    },
    inputField: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.border,
        color: colors.foreground,
        paddingStart: 8,
        paddingVertical: 6,
        fontSize: 16,
        marginTop: 12,
    },
});
