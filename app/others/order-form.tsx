import { RNKeyboardAwareScrollView } from "@/components/layout/KeyboardAwareScrollView";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import RNText from "@/components/ui/text";
import { useOrderStore } from "@/store/order";
import { StyleSheet, View } from "react-native";

export default function OrderForm() {
    const { tmpData } = useOrderStore();
    const { } = useOrderStore();
    return (
        <RNSafeAreaView style={styles.container}>
            <RNKeyboardAwareScrollView>
                <View>
                    <RNText>{JSON.stringify(tmpData)}</RNText>
                </View>
            </RNKeyboardAwareScrollView>
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});
