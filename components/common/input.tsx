import { colors } from "@/constants/colors";
import { StyleSheet, TextInputProps, View } from "react-native";
import { TextInput } from "react-native";
import RNText from "../ui/text";

type Props = {
    label?: string;
} & TextInputProps;

export function RNInput({ label, style, ...props }: Props) {
    return (
        <View style={{ flex: 1 }}>
            {label && label?.length > 0 && (
                <RNText style={styles.label}>{label}</RNText>
            )}
            <TextInput style={[style, styles.input]} {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.border,
        color: colors.foreground,
        paddingStart: 8,
        paddingVertical: 6,
        fontSize: 16,
    },
    label: {
        marginBottom: 4,
        fontSize: 14,
        fontWeight: "500",
        color: colors.muted,
    },
});
