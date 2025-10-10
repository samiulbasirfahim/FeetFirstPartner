import { StyleSheet, View } from "react-native";
import { OrderDataList } from "./order-data.list";
import { OrderHeader } from "./order-header";

export function OrderTab() {
    return (
        <View style={styles.Container}>
            <OrderHeader />
            <OrderDataList />
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
});
