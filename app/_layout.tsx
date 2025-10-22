import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RNToaster } from "@/components/ui/toaster";
import { StatusBar } from "expo-status-bar";
import * as navigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/auth";

export default function RootLayout() {
    const { isLoggedIn } = useAuthStore();

    if (Platform.OS === "android") navigationBar.setStyle("light");
    return (
        <GestureHandlerRootView>
            <KeyboardProvider>
                <Host>
                    <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                        <Stack.Protected guard={!isLoggedIn}>
                            <Stack.Screen name="index" />
                        </Stack.Protected>
                        <Stack.Protected guard={isLoggedIn}>
                            <Stack.Screen name="(tabs)" />
                        </Stack.Protected>
                    </Stack>
                    <StatusBar style="dark" />
                    <RNToaster />
                </Host>
            </KeyboardProvider>
        </GestureHandlerRootView>
    );
}
