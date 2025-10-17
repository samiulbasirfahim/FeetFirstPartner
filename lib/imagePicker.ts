import * as ImagePicker from "expo-image-picker";

export async function takePicture() {
    const response = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
        base64: true,
    });

    if (response.canceled) {
        console.log("User cancelled image picker");
        return;
    }

    console.log("Image picked:", response.assets[0].uri);
    if (response.assets.length === 0) {
        console.log("No assets found");
        return;
    }

    console.log(response.assets[0].uri);
    return response.assets[0].base64 ?? "";
}
