import { RNKeyboardAwareScrollView } from "@/components/layout/KeyboardAwareScrollView";
import { Image } from "expo-image";
import logo from "../assets/images/icon.png";
import RNSafeAreaView from "@/components/layout/SafeAreaView";
import { RNButton } from "@/components/ui/button";
import { RNInput } from "@/components/ui/input";
import RNText from "@/components/ui/text";
import { colors } from "@/constants/colors";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuthStore } from "@/store/auth";

export default function LoginScreen() {
    const { login } = useAuthStore();
    const handleSignIn = () => {
        login();
        router.replace("/(tabs)/scan");
    };

    return (
        <RNSafeAreaView>
            <RNKeyboardAwareScrollView>
                <RNText
                    variant="title"
                    style={{
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: 28,
                        marginTop: 32,
                    }}
                >
                    Login
                </RNText>
                <View>
                    <View style={styles.form}>
                        <Image
                            source={logo}
                            style={{
                                width: 80,
                                height: 80,
                                alignSelf: "center",
                                marginTop: 16,
                                marginBottom: 32,
                            }}
                        />
                        <RNInput label="E-Mail" />
                        <RNInput label="Passwort" secureTextEntry />
                        <RNButton
                            onPress={handleSignIn}
                            label="Anmelden"
                            variant="primary"
                            style={{ marginTop: 16 }}
                        />
                    </View>
                </View>
            </RNKeyboardAwareScrollView>
        </RNSafeAreaView>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: 24,
        gap: 8,
    },
});
