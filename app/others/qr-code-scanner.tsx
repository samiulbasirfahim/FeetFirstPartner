import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { handleQrCode } from "@/lib/handleQrCode";
import { useOrderStore } from "@/store/order";
import { useCameraPermissions, CameraView } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { Flashlight, FlashlightOff } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export default function QRCodeScanner() {
    const { setTmpData } = useOrderStore();
    const { width } = useWindowDimensions();
    const { status } = useLocalSearchParams<{
        status: "pending" | "completed" | "ready";
    }>();

    const [scanned, setScanned] = useState(false);

    const [persmission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);

    function toggleTorch() {
        setTorch((prev) => !prev);
    }

    if (!persmission) {
        requestPermission();
        return <View />;
    }

    return (
        <RNSafeAreaView>
            <View
                style={[
                    styles.container,
                    {
                        marginVertical: 8,
                        height: "auto",
                    },
                ]}
            >
                <RNText
                    variant="primary"
                    style={{
                        textAlign: "center",
                        color: colors.primary,
                        fontWeight: 500,
                        fontSize: 18,
                    }}
                >
                    Scan QR Code to mark order as {status}
                </RNText>
            </View>
            <CameraView
                facing="back"
                zoom={0.2}
                enableTorch={torch}
                style={[styles.cameraView, { height: width - 32 }]}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={(qr) => {
                    if (!scanned) {
                        setScanned(true);
                        handleQrCode(qr, (response) => {
                            if (response) {
                                setTmpData({ ...response, status: status });
                                router.push("/others/order-form");
                                setTimeout(() => {
                                    setScanned(false);
                                }, 2000);
                            } else {
                                setTimeout(() => {
                                    setScanned(false);
                                }, 4000);
                            }
                        });
                    }
                }}
            ></CameraView>
            <View style={styles.container}>
                <RNButton
                    icon={torch ? FlashlightOff : Flashlight}
                    onPress={toggleTorch}
                    variant="outline"
                    size="lg"
                />
            </View>
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    cameraView: {
        borderRadius: 12,
        position: "relative",
        margin: 12,
    },
});
