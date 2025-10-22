import { colors } from "@/constants/colors";
import { Captions } from "lucide-react-native";
import { ReactNode } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

type Variants = Record<string, TextStyle>;

const variants: Variants = {
  title: {
    fontSize: 24,
    color: colors.foreground,
    fontWeight: "semibold",
  },
  primary: {
    fontSize: 16,
    color: colors.foreground,
  },
  caption: {
    fontSize: 14,
    color: colors.muted,
  },
  base: {},
  error: {
    fontSize: 12,
    color: colors.error,
  },
};
type Props = {
  children: ReactNode;
  variant?: keyof typeof variants;
} & TextProps;

export default function RNText({
  children,
  variant = "base",
  style,
  ...props
}: Props) {
  return (
    <Text style={[variants[variant], style]} {...props}>
      {children}
    </Text>
  );
}
