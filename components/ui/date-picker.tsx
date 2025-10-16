import { colors } from "@/constants/colors";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
    onChangeDate: (date: string) => void;
    defaultDate?: Date;
};

const DatePick = forwardRef(({ onChangeDate, defaultDate }: Props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            showDatePicker,
        };
    });

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        onChangeDate(date.toISOString().split("T")[0]);
        hideDatePicker();
    };

    return (
        <View>
            <DateTimePickerModal
                {...({} as any)}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                modalStyleIOS={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
                date={defaultDate ?? new Date()}
                pickerContainerStyleIOS={{
                    backgroundColor: colors.background,
                    borderRadius: 20,
                    width: 500,
                }}
                pickerStyleIOS={{
                    width: "100%",
                    paddingHorizontal: 85,
                }}
                confirmTextIOS="OK"
                cancelTextIOS="Cancel"
                buttonTextColorIOS={colors.primary}
                customCancelButtonIOS={() => <TouchableOpacity></TouchableOpacity>}
            />
        </View>
    );
});

export default DatePick;
