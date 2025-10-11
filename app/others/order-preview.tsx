import RNText from "@/components/ui/text";
import { useOtherStore } from "@/store/others";
import { View } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { Portal } from "react-native-portalize";

export function OrderPrview() {
    const { showOrderPreview, setOrderPreview } = useOtherStore();

    return (
        <Portal>
            <Pressable
                onPress={() => setOrderPreview(false)}
                style={{
                    flex: 1,
                    inset: 0,
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: showOrderPreview ? "flex" : "none",
                }}
            ></Pressable>
            <View
                style={{
                    zIndex: 50,
                }}
            >
                <RNText>Order Preview</RNText>
            </View>
        </Portal>
    );
}
