import { TabIconRenderer } from "@/components/common/tab-bar-components";
import { Tabs } from "expo-router";
import { Package } from "lucide-react-native";

export default function WarehouseTab() {
    return (
        <>
            <Tabs.Screen
                options={{
                    title: "Lager",
                    tabBarIcon: (props) => {
                        return <TabIconRenderer icon={Package} {...props} />;
                    },
                }}
            />
        </>
    );
}
