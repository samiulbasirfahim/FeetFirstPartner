import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { useCameraPermissions, CameraView } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { Flashlight, FlashlightOff } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export default function QRCodeScanner() {
    const { width } = useWindowDimensions();
    const { status } = useLocalSearchParams<{
        status: "pending" | "completed" | "ready";
    }>();

    const [persmission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const [pos, setPos] = useState({
        x: 0,
        y: 0,
        height: 0,
        width: 0,
    });

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
                enableTorch={torch}
                style={[styles.cameraView, { height: width - 32 }]}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={(result) => {
                    setPos({
                        x: result.bounds.origin.x,
                        y: result.bounds.origin.y,
                        height: result.bounds.size.height,
                        width: result.bounds.size.width,
                    });
                    // setTimeout(() => {
                    //     router.push({})
                    // })
                    console.log("Scanned QR Code:", result);
                }}
            >
                <View
                    style={[
                        styles.guideBox,
                        {
                            top: pos.x,
                            right: pos.y,
                            height: pos.height,
                            width: pos.width,
                            transform: [{ translateY: -pos.height / 2 }],
                        },
                    ]}
                ></View>
            </CameraView>
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
    },

    guideBox: {
        position: "absolute",
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 12,
    },
});
