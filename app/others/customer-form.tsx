import { LoadingSpinner } from "@/components/common/loading";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import { RNInput } from "@/components/ui/input";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { useCustomerStore } from "@/store/customer";
import { FastForward, Save, SkipForward, X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function CustomerForm() {
    const { tmpData, setTmpData, isLoading } = useCustomerStore();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <RNSafeAreaView>
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ padding: 16, gap: 12 }}
            >
                <RNText variant="title">Patientdaten</RNText>
                <View style={styles.container}>
                    <RNInput label="Vorname" defaultValue={tmpData?.name} />
                    <RNInput label="Nachname" defaultValue={tmpData?.lastName} />
                    <RNInput
                        label="E-Mail"
                        keyboardType="email-address"
                        defaultValue={tmpData?.email}
                    />
                    <RNInput
                        label="Geburtsdatum"
                        placeholder="JJJJ-MM-TT"
                        defaultValue={tmpData?.dateOfBirth}
                    />
                    <RNInput
                        label="Krankenkasse"
                        defaultValue={tmpData?.healthInsuranceProvider}
                    />
                    <RNInput
                        label="Versichertennummer"
                        defaultValue={tmpData?.healthInsuranceNumber}
                    />
                    <RNInput
                        label="Medizinische Diagnose"
                        multiline
                        numberOfLines={4}
                        defaultValue={tmpData?.medicalDiagnosis}
                    />
                    <RNInput
                        label="Einlagenart"
                        multiline
                        numberOfLines={4}
                        defaultValue={tmpData?.typeOfInsoles}
                    />
                    <RNInput
                        label="Verordnung geprüft am"
                        placeholder="JJJJ-MM-TT"
                        defaultValue={tmpData?.validationOfPrescription}
                    />
                </View>

                <View
                    style={{
                        marginTop: 16,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                        gap: 8,
                    }}
                >
                    <RNButton variant="outline" label="Cancel" icon={X} />
                    <RNButton label="Save" icon={Save} />
                </View>
            </KeyboardAwareScrollView>
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 6,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
});
