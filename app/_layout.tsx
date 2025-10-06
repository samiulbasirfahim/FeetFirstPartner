import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RNToaster } from "@/components/ui/toaster";
import { StatusBar } from "expo-status-bar";
import * as navigationBar from "expo-navigation-bar";

export default function RootLayout() {
    navigationBar.setStyle("light");
    return (
        <GestureHandlerRootView>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="dark" />
            <RNToaster />
        </GestureHandlerRootView>
    );
}
