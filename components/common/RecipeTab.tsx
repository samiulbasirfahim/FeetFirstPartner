import { colors } from "@/constants/colors";
import { Camera } from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import RNText from "../ui/text";
import { RNButton } from "../ui/button";
import { scanCustomerForm } from "@/lib/scan-customer-form";
import { CustomerFull } from "@/types/customer";
import { useCustomerStore } from "@/store/customer";
import { router, usePathname } from "expo-router";

export function RecipeTab() {
    const { setTmpData, isLoading, setIsLoading } = useCustomerStore();
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Camera size={68} color={colors.foreground} />
                <RNText variant="title">Rezpet scannen</RNText>
            </View>
            <RNText
                style={{ textAlign: "center", marginTop: 12, color: colors.muted }}
            >
                Scannen Sie das Rezept mit der Kamera für automatische Erkennung
            </RNText>

            <RNButton
                icon={Camera}
                label="Rezept scannen"
                variant="primary"
                disabled={isLoading}
                size="md"
                style={[styles.button, { marginTop: 24, width: "80%" }]}
                onPress={async () => {
                    setIsLoading(true);
                    const customer = (await scanCustomerForm()) as CustomerFull | null;
                    if (customer) {
                        console.log("Scanned customer:", customer);
                        if (pathname !== "/others/customer-form") {
                            router.push({
                                pathname: "/others/customer-form",
                            });
                        }
                        setTmpData(customer);
                        setIsLoading(false);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    button: {},
});
