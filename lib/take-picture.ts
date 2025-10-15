import * as ImagePicker from "expo-image-picker";
import { uploadPhotoToCloudinary } from "./cloudinary";

export async function takePicture() {
    const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
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

    // return response.assets[0].uri;
    const image = await uploadPhotoToCloudinary(response.assets[0]);
    return image;
}
