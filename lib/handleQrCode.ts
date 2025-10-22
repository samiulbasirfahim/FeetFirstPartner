import { BarcodeScanningResult } from "expo-camera";
import { notify } from "./notify";

export type QRCodeResponse = {
    customer_id: number;
    order_id: number;
    order_title: string;
    order_price: number;
    order_createdAt: string;
    status?: "pending" | "completed" | "shipped";
};

export function handleQrCode(
    data: BarcodeScanningResult,
    callback: (response: QRCodeResponse | null) => void,
) {
    const qrData = data?.data;

    let jsonData: QRCodeResponse | null = null;

    try {
        const parsed = JSON.parse(qrData);
        jsonData = parsed;
    } catch (error) {
        console.log("Invalid QR Code.");
        notify({
            type: "error",
            message: "Ungültiger QR-Code. Bitte versuchen Sie es erneut.",
            title: "Fehler",
        });
    }

    callback(jsonData);
}
