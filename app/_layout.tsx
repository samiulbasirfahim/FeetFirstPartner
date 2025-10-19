import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RNToaster } from "@/components/ui/toaster";
import { StatusBar } from "expo-status-bar";
import * as navigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export default function RootLayout() {
    if (Platform.OS === "android") navigationBar.setStyle("light");
    return (
        <GestureHandlerRootView>
            <KeyboardProvider>
                <Host>
                    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                    <StatusBar style="dark" />
                    <RNToaster />
                </Host>
            </KeyboardProvider>
        </GestureHandlerRootView>
    );
}
