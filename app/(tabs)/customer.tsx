import { CustomerDataList } from "@/components/common/customer-data-list";
import { CustomerHeader } from "@/components/common/customer-header";
import { TabIconRenderer } from "@/components/common/tab-bar-components";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { colors } from "@/constants/colors";
import { router, Tabs } from "expo-router";
import { Plus, Users } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

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
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/scan",
                            params: { tab: "recipe" },
                        })
                    }
                    style={styles.plusView}
                >
                    <Plus color={colors.white} strokeWidth={1} width={40} height={40} />
                </Pressable>
            </RNSafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    plusView: {
        position: "absolute",
        bottom: 20,
        right: 20,
        borderWidth: 0,
        borderRadius: "50%",
        padding: 13,
        backgroundColor: colors.primary,
    },
});
