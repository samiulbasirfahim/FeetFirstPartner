import { TabIconRenderer } from "@/components/common/tab-bar-components";
import { WarehouseDataList } from "@/components/common/warehouse-data-list";
import { WareHouseHeader } from "@/components/common/warehouse-header";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { Tabs } from "expo-router";
import { Package } from "lucide-react-native";
import { WarehousePreview } from "../others/warehouse-preview";

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

            <RNSafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
                <WareHouseHeader />
                <WarehouseDataList />
                <WarehousePreview />
            </RNSafeAreaView>
        </>
    );
}
