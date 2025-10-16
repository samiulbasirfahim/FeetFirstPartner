import { colors } from "@/constants/colors";
import { full } from "@cloudinary/url-gen/qualifiers/fontHinting";
import React, { useRef, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import SignatureCanvas, {
    SignatureViewRef,
} from "react-native-signature-canvas";
import { RNButton } from "../ui/button";
import { Undo } from "lucide-react-native";

type Props = {
    signature: string | null;
    setSignature: (signature: string | null) => void;
};

export const SignatureBox = ({ signature, setSignature }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef<SignatureViewRef | null>(null);

    const handleSignature = (signature: string) => {
        setSignature(signature);
        setIsLoading(false);
    };

    const handleEmpty = () => {
        console.log("Signature is empty");
        setIsLoading(false);
    };

    const handleClear = () => {
        setSignature(null);
    };

    const handleError = (error) => {
        console.error("Signature pad error:", error);
        setIsLoading(false);
    };

    return (
        <View style={styles.preview}>
            {signature ? (
                signature && (
                    <>
                        <Image
                            resizeMode="contain"
                            style={{ width: "100%", height: "100%", flex: 1 }}
                            source={{ uri: signature }}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                justifyContent: "flex-end",
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                            }}
                        >
                            <RNButton
                                label="Zurücksetzen"
                                onPress={() => handleClear()}
                                variant="outline"
                            />
                        </View>
                    </>
                )
            ) : (
                <>
                    <SignatureCanvas
                        ref={ref}
                        onOK={handleSignature}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        onError={handleError}
                        autoClear={true}
                        descriptionText="Sign here"
                        clearText="Clear"
                        confirmText={isLoading ? "Processing..." : "Save"}
                        penColor={colors.foreground}
                        backgroundColor={colors.background}
                        webviewProps={{
                            cacheEnabled: true,
                            androidLayerType: "hardware",
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            gap: 8,
                        }}
                    >
                        <RNButton
                            label="Klar"
                            icon={Undo}
                            onPress={() => ref.current?.clearSignature()}
                            variant="outline"
                        />
                        <RNButton
                            label="Speichern"
                            onPress={() => {
                                setIsLoading(true);
                                ref.current?.readSignature();
                            }}
                            variant="outline"
                        />
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    preview: {
        width: "100%",
        height: 200,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
});
