import { colors } from "@/constants/colors";
import { ReactNode } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

type Variants = Record<string, TextStyle>;

const variants: Variants = {
    title: {
        fontSize: 24,
        color: colors.foreground,
    },
    primary: {
        fontSize: 16,
        color: colors.foreground,
    },
};
type Props = {
    children: ReactNode;
    variant?: keyof typeof variants;
} & TextProps;

export default function RNText({
    children,
    variant = "primary",
    style,
    ...props
}: Props) {
    return (
        <Text style={[style, variants[variant]]} {...props}>
            {children}
        </Text>
    );
}
