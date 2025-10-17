import { colors } from "@/constants/colors";
import { DateRange, useOrderStore } from "@/store/order";
import { Filter } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown, DropdownOption } from "./dropdown";
import RNText from "../ui/text";
import type { Order } from "@/types/order";

export function OrderHeader() {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState<
        "pending" | "completed" | "ready" | "all"
    >("all");

    const statusOptions: DropdownOption[] = [
        { label: "Alle", value: "all", placeHolder: "Alle" },
        { label: "Ausstehend", value: "pending", placeHolder: "Ausstehend" },
        {
            label: "Fertiggestellt",
            value: "completed",
            placeHolder: "Fertiggestellt",
        },
        { label: "Bereit zur Abholung", value: "ready", placeHolder: "Bereit" },
    ];

    const filterOptions: DropdownOption[] = [
        { label: "Alle", value: "all", placeHolder: "Alle" },
        { label: "Letzte 3 Tage", value: "last3days", placeHolder: "3" },
        { label: "Letzte Woche", value: "lastweek", placeHolder: "7" },
        { label: "Letzte 30 Tage", value: "last30days", placeHolder: "30" },
    ];

    const filterByRange = useOrderStore((s) => s.filterByRange);
    const filterByStatus = useOrderStore((s) => s.filterByStatus);

    const handleFilterSelect = (value: string) => {
        setSelectedFilter(value);

        let range = DateRange.All;
        if (value === "last3days") range = DateRange.ThreeDays;
        else if (value === "lastweek") range = DateRange.Week;
        else if (value === "last30days") range = DateRange.Month;

        filterByRange(range);
    };

    const handleStatusSelect = (value: string) => {
        setSelectedStatus(value as "pending" | "completed" | "ready" | "all");
        filterByStatus(value as Order["status"] | "all");
    };

    const selectedFilterPlaceHolder = filterOptions.find(
        (o) => o.value === selectedFilter,
    )?.placeHolder;

    const selectedStatusPlaceHolder = statusOptions.find(
        (o) => o.value === selectedStatus,
    )?.placeHolder;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <RNText variant="title">Aufträge</RNText>

                <View style={styles.filterGroup}>
                    <Dropdown
                        options={statusOptions}
                        selectedValue={selectedStatus}
                        onSelect={handleStatusSelect}
                        trigger={
                            <View style={styles.filterButton}>
                                <Filter size={16} color={colors.muted} />
                                <RNText style={styles.filterLabel}>
                                    {selectedStatusPlaceHolder}
                                </RNText>
                            </View>
                        }
                    />

                    <Dropdown
                        options={filterOptions}
                        selectedValue={selectedFilter}
                        onSelect={handleFilterSelect}
                        trigger={
                            <View style={styles.filterButton}>
                                <Filter size={16} color={colors.muted} />
                                <RNText style={styles.filterLabel}>
                                    {selectedFilterPlaceHolder}
                                </RNText>
                            </View>
                        }
                    />
                </View>
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
    filterGroup: {
        flexDirection: "row",
        gap: 8,
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
});
