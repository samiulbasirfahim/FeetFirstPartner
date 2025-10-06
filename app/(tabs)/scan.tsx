import { TabIconRenderer } from "@/components/common/tab-bar-components";
import { Tabs } from "expo-router";
import { ScanLine } from "lucide-react-native";

export default function ScanTab() {
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
        </>
    );
}
