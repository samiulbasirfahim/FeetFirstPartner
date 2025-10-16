import { ImagePickerAsset } from "expo-image-picker";
import { upload, uploadBase64 } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";

export async function uploadBase64ToCloudinary(
    base64: string,
): Promise<string | undefined> {
    if (!base64) {
        console.error("Base64 string is empty");
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
            const fileData = base64.startsWith("data:")
                ? base64
                : `data:image/jpeg;base64,${base64}`;

            uploadBase64(cld, {
                file: fileData,
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
