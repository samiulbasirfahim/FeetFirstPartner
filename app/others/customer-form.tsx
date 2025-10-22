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

    const refDOB = useRef<any>(null);
    const refPrescription = useRef<any>(null);

    const openDatePickerForDOB = () => refDOB.current?.showDatePicker(true);
    const openDatePickerForPrescription = () =>
        refPrescription.current?.showDatePicker(true);

    const onChangeDateOfBirth = (date: string) => {
        if (tmpData) setTmpData({ ...tmpData, dateOfBirth: date });
    };

    const onChangePrescriptionDate = (date: string) => {
        if (tmpData) setTmpData({ ...tmpData, dateOfPrescription: date });
    };

    return (
        <RNSafeAreaView>
            <RNKeyboardAwareScrollView>
                {/* Patient Data Section */}
                <RNText variant="title">Patientendaten</RNText>
                <View style={styles.container}>
                    {/* Gender */}
                    <View>
                        <RNText style={{ fontSize: 14, color: colors.muted }}>
                            Geschlecht
                        </RNText>
                        <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                            <RNButton
                                label="Mann"
                                variant={tmpData?.gender === "man" ? "primary" : "outline"}
                                size="sm"
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, gender: "man" })
                                }
                            />
                            <RNButton
                                size="sm"
                                label="Frau"
                                variant={tmpData?.gender === "woman" ? "primary" : "outline"}
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, gender: "woman" })
                                }
                            />
                        </View>
                    </View>

                    {/* Basic Patient Info */}
                    <RNInput
                        label="Vorname"
                        defaultValue={tmpData?.firstName}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, firstName: text })
                        }
                    />
                    <RNInput
                        label="Nachname"
                        defaultValue={tmpData?.lastName}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, lastName: text })
                        }
                    />
                    <RNInput
                        label="E-Mail"
                        keyboardType="email-address"
                        defaultValue={tmpData?.email}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, email: text })
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        autoComplete="email"
                    />
                    <RNInput
                        label="Adresse"
                        defaultValue={tmpData?.address}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, address: text })
                        }
                    />

                    {/* Date of Birth */}
                    <Pressable onPress={openDatePickerForDOB}>
                        <RNInput
                            label="Geburtsdatum"
                            placeholder="JJJJ-MM-TT"
                            defaultValue={tmpData?.dateOfBirth}
                            editable={false}
                        />
                    </Pressable>
                    <DatePicker
                        onChangeDate={onChangeDateOfBirth}
                        ref={refDOB}
                        defaultDate={
                            tmpData?.dateOfBirth ? new Date(tmpData.dateOfBirth) : new Date()
                        }
                    />

                    <RNInput
                        label="Versichertennummer"
                        defaultValue={tmpData?.insuranceNumber}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, insuranceNumber: text })
                        }
                    />
                    <RNInput
                        label="Status-Code"
                        defaultValue={tmpData?.statusCode}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, statusCode: text })
                        }
                    />

                    {/* Date of Prescription */}
                    <Pressable onPress={openDatePickerForPrescription}>
                        <RNInput
                            label="Datum der Verordnung"
                            placeholder="JJJJ-MM-TT"
                            defaultValue={tmpData?.dateOfPrescription}
                            editable={false}
                        />
                    </Pressable>
                    <DatePicker
                        onChangeDate={onChangePrescriptionDate}
                        ref={refPrescription}
                        defaultDate={
                            tmpData?.dateOfPrescription
                                ? new Date(tmpData.dateOfPrescription)
                                : new Date()
                        }
                    />
                </View>

                {/* Insurance Data Section */}
                <RNText variant="title" style={{ marginTop: 16 }}>
                    Versicherungsdaten
                </RNText>
                <View style={styles.container}>
                    <RNInput
                        label="Kostenträger / Krankenkasse"
                        placeholder="z.B. BARMER, AOK Bayern"
                        defaultValue={tmpData?.healthInsuranceProvider}
                        onChangeText={(text) =>
                            tmpData &&
                            setTmpData({ ...tmpData, healthInsuranceProvider: text })
                        }
                    />
                    <RNInput
                        label="Kostenträgerkennung"
                        placeholder="9-stellige Nummer"
                        keyboardType="numeric"
                        defaultValue={tmpData?.healthInsuranceProviderId}
                        onChangeText={(text) =>
                            tmpData &&
                            setTmpData({ ...tmpData, healthInsuranceProviderId: text })
                        }
                    />
                    <RNInput
                        label="Betriebsstätten-Nr. (BSNR)"
                        placeholder="9-stellige Nummer"
                        keyboardType="numeric"
                        defaultValue={tmpData?.clinicId}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, clinicId: text })
                        }
                    />
                    <RNInput
                        label="Verordnender Arzt"
                        placeholder="z.B. Dr. med. Max Mustermann"
                        defaultValue={tmpData?.prescribingDoctor}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, prescribingDoctor: text })
                        }
                    />
                    <RNInput
                        label="Praxisadresse"
                        placeholder="Straße, PLZ Stadt"
                        defaultValue={tmpData?.clinicAddress}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, clinicAddress: text })
                        }
                    />
                    <RNInput
                        label="Arzt-Nr. (LANR)"
                        placeholder="9-stellige Nummer"
                        keyboardType="numeric"
                        defaultValue={tmpData?.physicianId}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, physicianId: text })
                        }
                    />
                </View>

                {/* Medical Data Section */}
                <RNText variant="title" style={{ marginTop: 16 }}>
                    Medizinische Daten
                </RNText>
                <View style={styles.container}>
                    <RNInput
                        label="Ärztliche Diagnose"
                        placeholder="z.B. Knick-Senk-Spreizfuß bds."
                        multiline
                        numberOfLines={4}
                        defaultValue={tmpData?.medicalDiagnosis}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, medicalDiagnosis: text })
                        }
                    />
                    <RNInput
                        label="Art der Verordnung / Einlage"
                        placeholder="z.B. 2 Paar Weichpolsterbettungseinlagen..."
                        multiline
                        numberOfLines={4}
                        defaultValue={tmpData?.typeOfPrescription}
                        onChangeText={(text) =>
                            tmpData && setTmpData({ ...tmpData, typeOfPrescription: text })
                        }
                    />

                    {/* Importance Type - BVG Boxes */}
                    <View>
                        <RNText
                            style={{ fontSize: 14, color: colors.muted, marginBottom: 6 }}
                        >
                            BVG Kategorie (Wichtigkeit)
                        </RNText>
                        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                            <RNButton
                                label="6 - Hilfsmittel"
                                variant={
                                    tmpData?.importanceType === "6" ? "primary" : "outline"
                                }
                                size="sm"
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, importanceType: "6" })
                                }
                            />
                            <RNButton
                                label="7 - Impfstoff"
                                variant={
                                    tmpData?.importanceType === "7" ? "primary" : "outline"
                                }
                                size="sm"
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, importanceType: "7" })
                                }
                            />
                            <RNButton
                                label="8 - Sprechstundenbedarf"
                                variant={
                                    tmpData?.importanceType === "8" ? "primary" : "outline"
                                }
                                size="sm"
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, importanceType: "8" })
                                }
                            />
                            <RNButton
                                label="9 - Begleit-Pflicht"
                                variant={
                                    tmpData?.importanceType === "9" ? "primary" : "outline"
                                }
                                size="sm"
                                onPress={() =>
                                    tmpData && setTmpData({ ...tmpData, importanceType: "9" })
                                }
                            />
                        </View>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.actions}>
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
    actions: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        gap: 8,
    },
});
