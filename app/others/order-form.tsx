import { RNKeyboardAwareScrollView } from "@/components/layout/KeyboardAwareScrollView";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { notify } from "@/lib/notify";
import { useCustomerStore } from "@/store/customer";
import { useOrderStore } from "@/store/order";
import { StackActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { FastForward, Save } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

export default function OrderForm() {
    const { tmpData, addOrder, setTmpData, getOrderById, updateOrder } =
        useOrderStore();
    const { getCustomerFullDataById, updateCustomer, getCustomerById } =
        useCustomerStore();
    const navigation = useNavigation();

    const customer = tmpData
        ? getCustomerFullDataById(tmpData.customer_id)
        : null;

    const handleConfirm = () => {
        if (!tmpData) return;

        const orderExists = getOrderById(tmpData.order_id);

        if (orderExists) {
            updateOrder({
                id: tmpData.order_id,
                price: tmpData.order_price,
                status: tmpData.status!,
                customerId: tmpData.customer_id,
                customerName: customer?.name + " " + customer?.lastName,
                orderNumber: tmpData.order_id.toString(),
                createdAt: tmpData.order_createdAt,
            });
        } else {
            addOrder({
                id: tmpData.order_id,
                price: tmpData.order_price,
                status: tmpData.status!,
                customerId: tmpData.customer_id,
                customerName: customer?.name + " " + customer?.lastName,
                orderNumber: tmpData.order_id.toString(),
                createdAt: tmpData.order_createdAt,
            });
        }

        updateCustomer({
            ...getCustomerById(tmpData.customer_id)!,
            orderStatus: tmpData.status!,
            lastOrderDate: tmpData.order_createdAt!,
        });

        setTmpData(null);
        navigation.dispatch(StackActions.pop(2));

        notify({
            type: "success",
            message: "Bestellung erfolgreich gespeichert",
            title: "Erfolg",
        });
    };

    const handleSkip = () => {
        setTmpData(null);
        navigation.dispatch(StackActions.pop(2));
    };

    return (
        <RNSafeAreaView>
            <RNKeyboardAwareScrollView>
                <View style={styles.infoContainer}>
                    <RNText style={[styles.title, { marginTop: 0 }]}>Kundendaten</RNText>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Name: </RNText>
                        <RNText variant="caption">
                            {customer?.name + " " + customer?.lastName}
                        </RNText>
                    </View>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Geburtsdatum: </RNText>
                        <RNText variant="caption">{customer?.dateOfBirth}</RNText>
                    </View>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>E-Mail: </RNText>
                        <RNText variant="caption">{customer?.email}</RNText>
                    </View>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Versicherung: </RNText>
                        <RNText variant="caption">
                            {customer?.healthInsuranceProvider}
                        </RNText>
                    </View>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Diagnose: </RNText>
                        <RNText variant="caption">{customer?.medicalDiagnosis}</RNText>
                    </View>
                    <RNText style={styles.title}>Bestelldaten</RNText>
                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Titel: </RNText>
                        <RNText variant="caption">{tmpData?.order_title}</RNText>
                    </View>

                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Datum: </RNText>
                        <RNText variant="caption">{tmpData?.order_createdAt}</RNText>
                    </View>

                    <View style={styles.infoRow}>
                        <RNText style={{ fontWeight: "700" }}>Status: </RNText>
                        <RNText variant="caption">{tmpData?.status}</RNText>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <RNButton
                        icon={FastForward}
                        label="Skip"
                        variant="outline"
                        onPress={handleSkip}
                    />
                    <RNButton label="Confirm" icon={Save} onPress={handleConfirm} />
                </View>
            </RNKeyboardAwareScrollView>
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 4,
    },

    title: {
        fontSize: 24,
        fontWeight: "400",
        color: colors.foreground,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        paddingBottom: 4,
        marginTop: 16,
        marginBottom: 8,
    },
});
