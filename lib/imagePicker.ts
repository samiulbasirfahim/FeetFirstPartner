import * as ImagePicker from "expo-image-picker";

export async function imagePicker(): Promise<string | null> {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
    });

    if (result.canceled) {
        return null;
    }
    return result.assets[0].uri;
}
