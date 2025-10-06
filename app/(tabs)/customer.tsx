import { TabIconRenderer } from "@/components/common/tab-bar-components";
import { Tabs } from "expo-router";
import { Users } from "lucide-react-native";

export default function CustomerTab() {
    return (
        <>
            <Tabs.Screen
                options={{
                    title: "Kunden",
                    tabBarIcon: (props) => {
                        return <TabIconRenderer icon={Users} {...props} />;
                    },
                }}
            />
        </>
    );
}
