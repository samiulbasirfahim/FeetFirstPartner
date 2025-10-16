import * as FileSystem from "expo-file-system/legacy";

export const base64ToUri = async (
    base64Data: string,
    filename = "temp_image.jpg",
) => {
    try {
        if (!base64Data) {
            console.log("base64Data is empty or undefined");
            return null;
        }

        console.log(base64ToUri);
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: "base64",
        });

        return fileUri;
    } catch (error) {
        console.error("Erro ao converter base64 para URI:", error);
        throw error;
    }
};
