import { OrderTab } from "@/components/common/OrderTab";
import { RecipeTab } from "@/components/common/RecipeTab";
import { ScanTabBar } from "@/components/common/scan-tab-bar";
import { TabIconRenderer } from "@/components/common/tab-bar-components";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { Tabs, useLocalSearchParams } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useEffect, useState } from "react";

export default function ScanTab() {
    const [activeTab, setActiveTab] = useState<"orders" | "recipe">("orders");
    const { tab, uniqueId } = useLocalSearchParams();

    useEffect(() => {
        if (tab === "orders" || tab === "recipe") {
            setActiveTab(tab);
        }
    }, [tab, uniqueId]);

    return (
        <>
            <Tabs.Screen
                options={{
                    title: "Scannen",
                    tabBarIcon: (props) => {
                        return <TabIconRenderer icon={ScanLine} {...props} />;
                    },
                }}
            />

            <RNSafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
                <ScanTabBar setActiveTab={setActiveTab} activeTab={activeTab} />

                {activeTab === "orders" ? <OrderTab /> : <RecipeTab />}
            </RNSafeAreaView>
        </>
    );
}
