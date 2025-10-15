import { router } from "expo-router";
import { ArrowLeft, View } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export function BackButton() {
    return (
        <TouchableOpacity
            onPress={() => {
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/");
                }
            }}
        >
            <ArrowLeft />
        </TouchableOpacity>
    );
}
