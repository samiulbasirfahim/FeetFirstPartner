import { colors } from "@/constants/colors";
import { LucideIcon } from "lucide-react-native";

import {
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";
import RNText from "./text";

type StyleVariant = {
    text: TextStyle;
    button: ViewStyle;
};

type Variants = Record<string, StyleVariant>;

const variants: Variants = {
    success: {
        text: {
            fontSize: 18,
            color: colors.background,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: colors.success,
            padding: 10,
            borderRadius: 10,
            opacity: 0.8,
        },
    },
    error: {
        text: {
            fontSize: 18,
            color: colors.background,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: colors.error,
            padding: 10,
            borderRadius: 10,
            opacity: 0.8,
        },
    },

    outline: {
        text: {
            fontSize: 18,
            color: colors.foreground,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: colors.secondary,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 10,
            borderRadius: 10,
        },
    },

    green: {
        text: {
            fontSize: 18,
            color: colors.background,
        },
        button: {
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: colors.success,
            padding: 10,
            borderRadius: 10,
        },
    },

    primary: {
        text: {
            fontSize: 18,
            color: colors.background,
        },
        button: {
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 10,
        },
    },
};

type Props = {
    label?: string;
    icon?: LucideIcon;
    variant?: keyof typeof variants;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    textStyle?: TextStyle;
} & TouchableOpacityProps;

export function RNButton({
    label,
    variant = "primary",
    style,
    ...props
}: Props) {
    const { size = "md" } = props as Props;

    const sizeMap: Record<
        NonNullable<Props["size"]>,
        {
            fontSize: number;
            paddingVertical: number;
            paddingHorizontal: number;
            borderRadius?: number;
            iconSize?: number;
        }
    > = {
        xs: {
            fontSize: 12,
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 12,
            iconSize: 12,
        },
        sm: {
            fontSize: 14,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 8,
            iconSize: 14,
        },
        md: {
            fontSize: 16,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 8,
            iconSize: 18,
        },
        lg: {
            fontSize: 18,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            iconSize: 20,
        },
        xl: {
            fontSize: 20,
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderRadius: 12,
            iconSize: 22,
        },
        "2xl": {
            fontSize: 24,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 16,
            iconSize: 18,
        },
    };

    const sizeStyles = sizeMap[size];

    const buttonStyle = {
        ...variants[variant].button,
        paddingVertical: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        borderRadius:
            sizeStyles.borderRadius ?? variants[variant].button.borderRadius,
        flexShrink: 0,
        minWidth:
            (sizeStyles.iconSize ?? Math.round(sizeStyles.fontSize * 1.1)) * 2 +
            sizeStyles.paddingHorizontal * 2,
    };

    const textStyle = {
        ...variants[variant].text,
        fontSize: sizeStyles.fontSize,
    };

    const Icon = (props as any).icon as LucideIcon | undefined;
    const iconSize = sizeStyles.iconSize ?? Math.round(sizeStyles.fontSize * 1.1);
    const iconColor =
        (variants[variant].text.color as string) || colors.background;

    return (
        <TouchableOpacity
            style={[buttonStyle, style, { opacity: props.disabled ? 0.5 : 1 }]}
            activeOpacity={0.8}
            {...props}
        >
            {Icon && <Icon color={iconColor} size={iconSize} />}
            {
                <RNText variant="base" style={[textStyle, props.textStyle]}>
                    {label}
                </RNText>
            }
        </TouchableOpacity>
    );
}
