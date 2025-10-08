import { colors } from "@/constants/colors";
import { ReactNode } from "react";
import {
    SafeAreaView,
    SafeAreaViewProps,
} from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
} & SafeAreaViewProps;

export default function RNSafeAreaView({ children, style, ...props }: Props) {
    return (
        <SafeAreaView
            {...props}
            style={[
                style,
                {
                    flex: 1,
                    backgroundColor: colors.background,
                },
            ]}
        >
            {children}
        </SafeAreaView>
    );
}
