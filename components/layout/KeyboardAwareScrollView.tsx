import { ReactNode } from "react";
import {
    KeyboardAwareScrollView,
    KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

type Props = {
    children: ReactNode;
} & KeyboardAwareScrollViewProps;

export function RNKeyboardAwareScrollView({ children, ...props }: Props) {
    return (
        <KeyboardAwareScrollView
            keyboardDismissMode="on-drag"
            bottomOffset={20}
            children={children}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            {...props}
        />
    );
}
