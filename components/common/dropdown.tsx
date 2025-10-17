import { colors } from "@/constants/colors";
import { useCallback, useRef, useState } from "react";
import {
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Portal } from "react-native-portalize";
import RNText from "../ui/text";

export interface DropdownOption {
    label: string;
    value: string;
    placeHolder?: string;
}

interface DropdownProps {
    options: DropdownOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
    trigger: React.ReactNode;
}

export function Dropdown({
    options,
    selectedValue,
    onSelect,
    trigger,
}: DropdownProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const buttonRef = useRef<View | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{
        left: number;
        top: number;
    } | null>(null);

    const toggleDropdown = useCallback(() => {
        if (!showDropdown) {
            buttonRef.current?.measureInWindow((x, y, width, height) => {
                const menuMinWidth = 160;
                const screenWidth = Dimensions.get("window").width;
                let left = x;
                if (left + menuMinWidth + 12 > screenWidth) {
                    left = Math.max(12, screenWidth - menuMinWidth - 12);
                }
                const top = y + height + 8;
                setDropdownPos({ left, top });
                setShowDropdown(true);
            });
        } else {
            setShowDropdown(false);
        }
    }, [showDropdown]);

    const handleSelect = (value: string) => {
        onSelect(value);
        setShowDropdown(false);
    };

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={toggleDropdown}
                ref={buttonRef}
                accessibilityRole="button"
            >
                {trigger}
            </TouchableOpacity>

            {showDropdown && dropdownPos && (
                <Portal>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setShowDropdown(false)}
                        accessibilityLabel="Schließen"
                    />

                    <View
                        style={[
                            styles.dropdownMenu,
                            {
                                position: "absolute",
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                            },
                        ]}
                    >
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => handleSelect(opt.value)}
                                style={[
                                    styles.dropdownItem,
                                    opt.value === selectedValue && styles.dropdownItemSelected,
                                ]}
                            >
                                <RNText variant="primary">{opt.label}</RNText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Portal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    dropdownMenu: {
        zIndex: 50,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 8,
        minWidth: 160,
        elevation: 6,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
            },
        }),
    },
    dropdownItem: {
        zIndex: 50,
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    dropdownItemSelected: {
        backgroundColor: colors.secondary,
        borderRadius: 6,
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
    },
});
