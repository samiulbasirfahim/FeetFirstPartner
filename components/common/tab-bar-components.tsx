import { colors } from "@/constants/colors";
import { LucideIcon } from "lucide-react-native";
import { Text } from "react-native";

type Props = {
    icon: LucideIcon;
    focused: boolean;
};
export function TabIconRenderer({ focused, ...prop }: Props) {
    return (
        <prop.icon
            strokeWidth={1.4}
            color={focused ? colors.background : colors.foreground}
        />
    );
}

export function TabBarLabel(props: any) {
    return (
        <Text
            style={{
                color: props.focused ? colors.background : colors.foreground,
            }}
            {...props}
        />
    );
}
