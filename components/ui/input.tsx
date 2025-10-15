import { StyleSheet, TextInputProps, View } from "react-native";
import RNText from "./text";
import { TextInput } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
    label?: string;
} & TextInputProps;

export function RNInput({ label, style, ...props }: Props) {
    return (
        <View style={styles.container}>
            {label && <RNText style={styles.label}>{label}</RNText>}
            <TextInput
                placeholderTextColor={colors.muted}
                style={[style, styles.input]}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 2,
    },
    label: {
        fontSize: 14,
        color: colors.muted,
    },
    input: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderColor: colors.border,
        color: colors.foreground,
        borderRadius: 8,
    },
});
