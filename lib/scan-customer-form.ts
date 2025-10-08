import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

export async function ScanCustomerForm() {
    try {
        const res = await ImagePicker.launchCameraAsync();
        const image = res.assets;
    } catch (err) {
        console.log(err);
    }
}
