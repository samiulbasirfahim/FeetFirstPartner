import { colors } from "@/constants/colors";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Portal } from "react-native-portalize";

export function FloatingFormContainer({
    showModal = false,
    children,
    onClose,
}: {
    children: React.ReactNode;
    showModal: boolean;
    onClose: () => void;
}) {
    if (!showModal) return null;

    return (
        <Portal>
            <Pressable onPress={onClose} style={styles.backdrop}>
                <Pressable
                    onPress={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    style={styles.container}
                >
                    <KeyboardAwareScrollView
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View style={styles.innerContainer}>{children}</View>
                    </KeyboardAwareScrollView>
                </Pressable>
            </Pressable>
        </Portal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "90%",
        maxHeight: "60%",
        overflow: "hidden",
        borderRadius: 12,
    },
    innerContainer: {
        borderRadius: 12,
        overflow: "hidden",
        padding: 12,
        paddingBottom: 20,
        backgroundColor: colors.background,
        flex: 1,
    },
});
