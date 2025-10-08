import { colors } from "@/constants/colors";
import { LucideIcon } from "lucide-react-native";
import RNText from "../ui/text";

type Props = {
    icon: LucideIcon;
    focused: boolean;
};
export function TabIconRenderer({ focused, ...prop }: Props) {
    return (
        <prop.icon
            strokeWidth={1.5}
            fill={focused ? colors.background : "transparent"}
            color={focused ? colors.background : colors.foreground}
        />
    );
}

export function TabBarLabel(props: any) {
    return (
        <RNText
            style={{
                color: props.focused ? colors.background : colors.foreground,
            }}
            {...props}
        />
    );
}
