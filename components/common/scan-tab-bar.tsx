import { View, StyleSheet } from "react-native";
import { RNButton } from "../ui/button";
import { colors } from "@/constants/colors";

type Props = {
    activeTab: "orders" | "recipe";
    setActiveTab: (tab: "orders" | "recipe") => void;
};

export function ScanTabBar({ setActiveTab, activeTab }: Props) {
    type PropsTabButton = {
        label: string;
        value: "orders" | "recipe";
    };

    function TabBarButton({ label, value }: PropsTabButton) {
        const isActive = activeTab === value;
        return (
            <RNButton
                style={[
                    styles.tabButton,
                    {
                        borderBottomColor: isActive ? colors.primary : colors.border,
                    },
                ]}
                textStyle={{
                    color: isActive ? colors.primary : colors.foreground,
                }}
                variant="outline"
                label={label}
                size="sm"
                onPress={() => setActiveTab(value)}
            />
        );
    }

    return (
        <View style={styles.container}>
            <TabBarButton value="orders" label="Aufträge" />
            <TabBarButton value="recipe" label="Rezept scannen" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    tabButton: {
        flex: 1,
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
        borderBottomWidth: 2,
    },
});
