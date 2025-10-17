import { LoadingSpinner } from "@/components/common/loading";
import { RNKeyboardAwareScrollView } from "@/components/layout/KeyboardAwareScrollView";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import { RNInput } from "@/components/ui/input";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { useCustomerStore } from "@/store/customer";
import { router } from "expo-router";
import { FastForward, X } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function CustomerForm() {
    const { tmpData, setTmpData, isLoading } = useCustomerStore();

    function handleNext() {
        router.push("/others/customer-signature");
    }

    function handleCancel() {
        setTmpData(null);
        if (router.canGoBack()) router.back();
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const refD = useRef<any>(null);
    const refP = useRef<any>(null);

    const openDatePickerForPresValidation = () => {
        refP.current?.showDatePicker(true);
    };

    const onChnagePresValidation = (date: string) => {
        if (tmpData) {
            setTmpData({
                ...tmpData,
                dateOfBirth: date,
            });
        }
    };

    const openDatePickerForDateOfBirth = () => {
        refD.current?.showDatePicker(true);
    };

    const onChnageDateOfBirth = (date: string) => {
        if (tmpData) {
            setTmpData({
                ...tmpData,
                dateOfBirth: date,
            });
        }
    };

    return (
        <RNSafeAreaView>
            <RNKeyboardAwareScrollView>
                <RNText variant="title">Patientdaten</RNText>
                <View style={styles.container}>
                    <View>
                        <RNText
                            style={{
                                fontSize: 14,
                                color: colors.muted,
                            }}
                        >
                            Geschlecht
                        </RNText>
                        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                            <RNButton
                                label="Mann"
                                variant={tmpData?.gender === "man" ? "primary" : "outline"}
                                size="sm"
                                onPress={() => {
                                    if (tmpData)
                                        setTmpData({
                                            ...tmpData,
                                            gender: "man",
                                        });
                                }}
                            />
                            <RNButton
                                size="sm"
                                label="Frau"
                                variant={tmpData?.gender === "woman" ? "primary" : "outline"}
                                onPress={() => {
                                    if (tmpData)
                                        setTmpData({
                                            ...tmpData,
                                            gender: "woman",
                                        });
                                }}
                            />
                        </View>
                    </View>
                    <RNInput label="Vorname" defaultValue={tmpData?.name} />
                    <RNInput label="Nachname" defaultValue={tmpData?.lastName} />
                    <RNInput
                        label="E-Mail"
                        keyboardType="email-address"
                        defaultValue={tmpData?.email}
                        onChangeText={(text) => {
                            if (tmpData)
                                setTmpData({
                                    ...tmpData,
                                    email: text,
                                });
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        autoComplete="email"
                    />
                    <Pressable onPress={openDatePickerForDateOfBirth}>
                        <RNInput
                            label="Geburtsdatum"
                            placeholder="JJJJ-MM-TT"
                            defaultValue={tmpData?.dateOfBirth}
                            editable={false}
                        />
                        <DatePicker
                            onChangeDate={onChnagePresValidation}
                            ref={refD}
                            defaultDate={new Date(tmpData?.dateOfBirth as string)}
                        />
                    </Pressable>
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
                    <Pressable onPress={openDatePickerForPresValidation}>
                        <RNInput
                            label="Verordnung geprüft am"
                            placeholder="JJJJ-MM-TT"
                            defaultValue={tmpData?.validationOfPrescription}
                            editable={false}
                        />
                    </Pressable>
                    <DatePicker
                        onChangeDate={onChnageDateOfBirth}
                        ref={refP}
                        defaultDate={new Date(tmpData?.validationOfPrescription as string)}
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
                    <RNButton
                        variant="outline"
                        label="Stornieren"
                        icon={X}
                        onPress={handleCancel}
                    />
                    <RNButton label="Nächste" icon={FastForward} onPress={handleNext} />
                </View>
            </RNKeyboardAwareScrollView>
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
