import { ImagePickerAsset } from "expo-image-picker";
import { upload } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";

export async function uploadPhotoToCloudinary(
    file: ImagePickerAsset,
): Promise<string | undefined> {
    if (!file.uri) {
        console.error("File URI is not set");
        return undefined;
    }

    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
            apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || "",
            apiSecret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || "",
        },
        url: { secure: true },
    });

    return new Promise((resolve) => {
        try {
            upload(cld, {
                file: file.uri,
                callback: (error, result) => {
                    if (error) {
                        console.error("Upload error:", error);
                        resolve(undefined);
                        return;
                    }
                    resolve(result?.secure_url || undefined);
                },
            });
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            resolve(undefined);
        }
    });
}
