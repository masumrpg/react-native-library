import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { Calendar as WixCalendar } from "react-native-calendars";
export interface CalendarDayData {
    year: number;
    month: number;
    day: number;
    timestamp: number;
    dateString: string;
}
export interface CalendarDayMarking {
    selected?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
    disabled?: boolean;
    isMiddle?: boolean;
}
export interface CalendarProps extends Omit<React.ComponentProps<typeof WixCalendar>, "current"> {
    style?: StyleProp<ViewStyle>;
    current?: string;
    enableYearMonthPicker?: boolean;
}
export declare function Calendar({ style, theme, markingType, markedDates, current, enableYearMonthPicker, ...props }: CalendarProps): React.JSX.Element;
//# sourceMappingURL=Calendar.d.ts.map