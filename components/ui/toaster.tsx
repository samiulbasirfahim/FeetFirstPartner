import { colors } from "@/constants/colors";
import { Toaster } from "sonner-native";

export function RNToaster() {
    return (
        <Toaster
            theme="light"
            icons={{
                success: null,
                error: null,
                loading: null,
                info: null,
            }}
            toastOptions={{
                style: {
                    backgroundColor: colors.background,
                    borderRadius: 4,
                },
            }}
        />
    );
}
