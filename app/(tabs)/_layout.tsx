import { TabBarLabel } from "@/components/common/tab-bar-components";
import { colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const { bottom } = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                lazy: false,
                tabBarLabel: TabBarLabel,
                tabBarInactiveBackgroundColor: colors.white,
                tabBarLabelStyle: {
                    fontSize: 14,
                },
                tabBarItemStyle: {
                    margin: 10,
                    borderRadius: 20,
                    backgroundColor: colors.primary,
                },
                tabBarStyle: {
                    backgroundColor: colors.white,
                    height: 80 + bottom,
                },
            }}
        >
            <Tabs.Screen name="scan" />
            <Tabs.Screen name="customer" />
            <Tabs.Screen name="warehouse" />
        </Tabs>
    );
}
