import { colors } from "@/constants/colors";
import { DateRange, useOrderStore } from "@/store/order";
import { Camera, Filter } from "lucide-react-native";
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
import { RNButton } from "../ui/button";

export function OrderHeader() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const buttonRef = useRef<View | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{
        left: number;
        top: number;
    } | null>(null);

    const toggleDropdown = useCallback(() => {
        if (!showDropdown) {
            // measure the button position in window coordinates
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

    const filterOptions = [
        { label: "Alle", value: "all" },
        { label: "Letzte 3 Tage", value: "last3days" },
        { label: "Letzte Woche", value: "lastweek" },
        { label: "Letzte 30 Tage", value: "last30days" },
    ];

    const filterByRange = useOrderStore((s) => s.filterByRange);

    const handleSelect = (value: string) => {
        setSelectedFilter(value);
        setShowDropdown(false);

        // map local value to DateRange enum
        let range = DateRange.All;
        if (value === "last3days") range = DateRange.ThreeDays;
        else if (value === "lastweek") range = DateRange.Week;
        else if (value === "last30days") range = DateRange.Month;

        filterByRange(range);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <RNText variant="title">Aufträge</RNText>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={toggleDropdown}
                    style={styles.filterButton}
                    ref={buttonRef}
                    accessibilityRole="button"
                    accessibilityLabel="Filter anzeigen"
                >
                    <Filter size={16} color={colors.muted} />
                    <RNText style={styles.filterLabel}>
                        {filterOptions.find((o) => o.value === selectedFilter)?.label}
                    </RNText>
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
                            {filterOptions.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    onPress={() => handleSelect(opt.value)}
                                    style={[
                                        styles.dropdownItem,
                                        opt.value === selectedFilter && styles.dropdownItemSelected,
                                    ]}
                                >
                                    <RNText variant="primary">{opt.label}</RNText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Portal>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    filterButton: {
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: colors.secondary,
        maxWidth: 220,
        flexDirection: "row",
        alignItems: "center",
    },
    filterLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.foreground,
    },
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
