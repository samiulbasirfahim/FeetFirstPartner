import { CustomerDataList } from "@/components/common/customer-data-list";
import { CustomerHeader } from "@/components/common/customer-header";
import { TabIconRenderer } from "@/components/common/tab-bar-components";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
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

            <RNSafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
                <CustomerHeader />
                <CustomerDataList />
            </RNSafeAreaView>
        </>
    );
}
