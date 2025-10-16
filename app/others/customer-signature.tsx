import { BackButton } from "@/components/common/back-button";
import { SignatureBox } from "@/components/common/signature-box";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { uploadBase64ToCloudinary } from "@/lib/cloudinary";
import { notify } from "@/lib/notify";
import { useCustomerStore } from "@/store/customer";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CustomerSignature() {
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const navigation = useNavigation();
    const { addCustomer, tmpData, setTmpData } = useCustomerStore();

    async function uploadSignature() {
        if (!signature) return;
        setIsLoading(true);

        try {
            const uri = await uploadBase64ToCloudinary(signature);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error uploading signature:", error);
        }
    }

    return (
        <RNSafeAreaView style={{ padding: 16, gap: 12 }}>
            <BackButton />
            <RNText variant="title">Datenschutz & Einwilligung</RNText>
            <RNText variant="primary" style={{ textAlign: "justify" }}>
                Mit meiner Unterschrift willige ich ein, die Kosten des Auftrags selbst
                zu übernehmen, falls die Krankenkasse meine nachträgliche Leistung nicht
                bewilligt bzw. die Kosten nicht übernimmt. Mit meiner Unterschrift
                bestätige ich, dass die Orthopädieschuhtechnik Wild-Schlögl KG meine
                genannten Daten gemäß der DSGVO zur Weiterverarbeitung verwenden darf.
                Ich nehme zur Kenntnis, dass bei Nichterhaltung des vereinbarten Termins
                bzw. nicht rechtzeitig erfolgter Terminabsage (24 Stunden zuvor) eine
                Ausfallentschädigung in Höhe von 25 € verrechnet wird. Außerdem werden
                die Einlagen bei Nichtabholung per Post zugesendet und Porto von 7 € in
                Rechnung gestellt.
            </RNText>
            <Pressable
                onPress={() => {
                    setIsChecked((prev) => !prev);
                }}
                style={styles.checkBoxContainer}
            >
                <View
                    style={[
                        styles.checkBox,
                        {
                            borderColor: isChecked ? colors.foreground : colors.muted,
                        },
                    ]}
                >
                    {isChecked && <Check size={18} />}
                </View>
                <RNText
                    style={{
                        color: isChecked ? colors.foreground : colors.muted,
                    }}
                >
                    Ich habe die Hinweise gelesen und akzeptiere sie.
                </RNText>
            </Pressable>

            <SignatureBox signature={signature} setSignature={setSignature} />

            <RNButton
                label={isLoading ? "Laden..." : "Unterschrift hochladen"}
                size="lg"
                disabled={!signature || !isChecked || isLoading}
                onPress={async () => {
                    await uploadSignature();
                    notify({
                        type: "success",
                        message: "Kunde erfolgreich angelegt",
                        title: "Erfolg",
                    });
                    addCustomer({
                        dateOfBirth: tmpData?.dateOfBirth!,
                        contact: tmpData?.email!,
                        fullName: `${tmpData?.name!} ${tmpData?.lastName!}`,
                        lastOrderDate: new Date().toISOString(),
                        orderStatus: "ready",
                    });
                    navigation.dispatch(StackActions.pop(2));
                }}
            />
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    checkBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    checkBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 4,
        paddingVertical: 8,
    },
});
