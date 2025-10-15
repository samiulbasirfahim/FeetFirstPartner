import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import { RNInput } from "@/components/ui/input";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { FastForward, Save, SkipForward, X } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function CustomerForm() {
    return (
        <RNSafeAreaView>
            <KeyboardAwareScrollView
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ padding: 16, gap: 12 }}
            >
                <RNText variant="title">Patientdaten</RNText>
                <View style={styles.container}>
                    <RNInput label="Vorname" />
                    <RNInput label="Nachname" />
                    <RNInput label="E-Mail" keyboardType="email-address" />
                    <RNInput label="Geburtsdatum" placeholder="JJJJ-MM-TT" />
                    <RNInput label="Krankenkasse" />
                    <RNInput label="Versichertennummer" />
                    <RNInput label="Medizinische Diagnose" multiline numberOfLines={4} />
                    <RNInput label="Einlagenart" multiline numberOfLines={4} />
                    <RNInput label="Verordnung geprüft am" placeholder="JJJJ-MM-TT" />
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
