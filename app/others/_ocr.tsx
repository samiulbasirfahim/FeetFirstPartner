import React, { useState } from "react";
import {
    View,
    Text,
    Button,
    Image,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Tesseract from "tesseract.js";

export default function OCRScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            runOCR(uri);
        }
    };

    const runOCR = async (uri: string) => {
        try {
            setLoading(true);
            setText("");
            const res = await Tesseract.recognize(uri, "eng", {
                logger: (m) => console.log(m),
            });
            setText(res.data.text);
        } catch (err) {
            console.error("OCR error:", err);
            setText("Failed to extract text");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
            <Button title="Upload Photo for OCR" onPress={pickImage} />
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: 200, marginVertical: 10 }}
                    resizeMode="contain"
                />
            )}

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <ScrollView style={{ marginTop: 20 }}>
                <Text selectable>{text || "No text extracted yet."}</Text>
            </ScrollView>
        </View>
    );
}
