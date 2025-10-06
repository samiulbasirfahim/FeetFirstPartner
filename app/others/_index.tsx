import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.background,
                alignItems: "center",
            }}
        >
            <RNText>Edit app/index.tsx to edit this screen.</RNText>
            <Link href={"/signature"}>
                <RNText>OPEN SIGNATURE WINDOW</RNText>
            </Link>

            <Link href={"/ocr"}>
                <RNText>OCR TEST SCREEN</RNText>
            </Link>
            <TouchableOpacity
                onPress={() => {
                    toast("Hello");
                }}
            >
                <RNText>SHOW Toast</RNText>
            </TouchableOpacity>
        </View>
    );
}
