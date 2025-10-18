import { toast } from "sonner-native";

type Props = {
    title: string;
    message: string;
    type: "success" | "error" | "info";
};

export function notify({ title, message, type }: Props) {
    switch (type) {
        case "success":
            toast.success(message, {
                description: title,
                style: {
                    backgroundColor: "#e6ffed",
                },
            });
            break;
        case "error":
            toast.error(message, {
                description: title,
                style: {
                    backgroundColor: "#ffeded",
                },
            });
            break;
        case "info":
            toast(message, { description: title });
            break;
        default:
            toast(message, { description: title });
            break;
    }
}
