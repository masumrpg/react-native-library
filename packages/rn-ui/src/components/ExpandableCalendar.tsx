import React, { forwardRef } from "react";
import {
  AgendaList as WixAgendaList,
  CalendarProvider as WixCalendarProvider,
  ExpandableCalendar as WixExpandableCalendar,
  WeekCalendar as WixWeekCalendar,
  type AgendaListProps as WixAgendaListProps,
  type CalendarContextProviderProps as WixCalendarContextProviderProps,
  type ExpandableCalendarProps as WixExpandableCalendarProps,
  type WeekCalendarProps as WixWeekCalendarProps,
} from "react-native-calendars";
import { Positions } from "react-native-calendars/src/expandableCalendar";
import { useTheme } from "../theme";
import {
  CalendarArrow,
  CalendarDayButton,
  type CalendarDayData,
  type CalendarDayMarking,
} from "./Calendar";

export { Positions as CalendarPositions };

export type ExpandableCalendarRef = {
  toggleCalendarPosition: () => boolean;
};

export interface ExpandableCalendarProps
  extends Omit<WixExpandableCalendarProps, "markedDates" | "initialPosition"> {
  markedDates?: Record<string, CalendarDayMarking>;
  initialPosition?: "closed" | "open" | Positions;
  renderArrow?: (direction: "left" | "right") => React.ReactNode;
}

export interface CalendarProviderProps
  extends WixCalendarContextProviderProps {}

export interface AgendaListProps extends WixAgendaListProps {}

export interface WeekCalendarProps extends Omit<WixWeekCalendarProps, "markedDates"> {
  markedDates?: Record<string, CalendarDayMarking>;
}

export function CalendarProvider({
  theme,
  children,
  todayBottomMargin = 20,
  todayButtonStyle,
  ...props
}: CalendarProviderProps) {
  const { colors, isDark, radii } = useTheme();

  const defaultTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontWeight: "600" as const,
    textMonthFontSize: 16,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500" as const,
    arrowColor: colors.text,
    disabledArrowColor: colors.disabledText,
    todayTextColor: colors.primary,
    todayButtonTextColor: colors.primary,
    todayButtonPosition: "left" as const,
    todayButtonFontWeight: "700" as const,
    todayButtonFontSize: 12.5,
    stylesheet: {
      expandable: {
        main: {
          todayButton: {
            height: 34,
            paddingHorizontal: 14,
            borderRadius: radii.full,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isDark ? colors.surfaceRaised : "#FFFFFF",
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: "#000000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { height: 3, width: 0 },
            elevation: 4,
          },
          todayButtonText: {
            color: colors.primary,
            fontSize: 12.5,
            fontWeight: "700",
          },
          todayButtonImage: {
            tintColor: colors.primary,
            marginRight: 6,
          },
          todayButtonContainer: {
            position: "absolute",
            left: 20,
            bottom: 0,
          },
          ...((theme as Record<string, unknown> | undefined)?.stylesheet as Record<string, Record<string, Record<string, unknown>>> | undefined)?.expandable?.main,
        },
      },
    },
    ...theme,
  };

  const resolvedTodayButtonStyle = {
    backgroundColor: isDark ? colors.surfaceRaised : "#FFFFFF",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.full,
    ...todayButtonStyle,
  };

  return (
    <WixCalendarProvider
      theme={defaultTheme}
      todayBottomMargin={todayBottomMargin}
      todayButtonStyle={resolvedTodayButtonStyle}
      {...props}
    >
      {children}
    </WixCalendarProvider>
  );
}

export const ExpandableCalendar = forwardRef<
  ExpandableCalendarRef,
  ExpandableCalendarProps
>(function ExpandableCalendar(
  { theme, markedDates, renderArrow, initialPosition = "closed", ...props },
  ref,
) {
  const { colors, isDark, radii } = useTheme();

  const customTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontWeight: "600" as const,
    textMonthFontSize: 16,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500" as const,
    arrowColor: colors.text,
    disabledArrowColor: colors.disabledText,
    todayTextColor: colors.primary,
    knobColor: colors.border,
    expandableKnobColor: colors.border,
    backgroundColor: colors.surface,
    "stylesheet.expandable.main": {
      knobContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        height: 24,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surface,
        borderBottomLeftRadius: radii.xl,
        borderBottomRightRadius: radii.xl,
      },
      knob: {
        width: 36,
        height: 4,
        borderRadius: radii.full,
        backgroundColor: colors.border,
      },
      todayButton: {
        height: 34,
        paddingHorizontal: 14,
        borderRadius: radii.full,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDark ? colors.surfaceRaised : "#FFFFFF",
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { height: 3, width: 0 },
        elevation: 4,
      },
      todayButtonText: {
        color: colors.primary,
        fontSize: 12.5,
        fontWeight: "700",
      },
      todayButtonImage: {
        tintColor: colors.primary,
        marginRight: 6,
      },
      ...(((theme as Record<string, unknown> | undefined)?.["stylesheet.expandable.main"] as Record<string, unknown>) || {}),
    },
    ...theme,
  };

  return (
    <WixExpandableCalendar
      ref={ref as never}
      theme={customTheme}
      initialPosition={initialPosition as Positions}
      renderArrow={
        renderArrow ||
        ((direction) => (
          <CalendarArrow direction={direction as "left" | "right"} />
        ))
      }
      markedDates={
        markedDates as unknown as WixExpandableCalendarProps["markedDates"]
      }
      dayComponent={({ date, state, marking, onPress, onLongPress }) => (
        <CalendarDayButton
          date={date as unknown as CalendarDayData}
          state={state as "selected" | "disabled" | "today" | ""}
          marking={marking as unknown as CalendarDayMarking}
          onPress={onPress as unknown as (date: CalendarDayData) => void}
          onLongPress={
            onLongPress as unknown as (date: CalendarDayData) => void
          }
        />
      )}
      {...props}
    />
  );
});

export function AgendaList({ theme, sectionStyle, ...props }: AgendaListProps) {
  const { colors } = useTheme();

  const defaultSectionStyle = {
    backgroundColor: colors.surfaceMuted,
    color: colors.textMuted,
    textTransform: "capitalize" as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...sectionStyle,
  };

  return (
    <WixAgendaList
      theme={theme}
      sectionStyle={defaultSectionStyle}
      {...props}
    />
  );
}

export function WeekCalendar({
  theme,
  markedDates,
  ...props
}: WeekCalendarProps) {
  const { colors } = useTheme();

  const customTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontWeight: "600" as const,
    textMonthFontSize: 16,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500" as const,
    arrowColor: colors.text,
    disabledArrowColor: colors.disabledText,
    todayTextColor: colors.primary,
    ...theme,
  };

  return (
    <WixWeekCalendar
      theme={customTheme}
      markedDates={
        markedDates as unknown as WixWeekCalendarProps["markedDates"]
      }
      dayComponent={({ date, state, marking, onPress, onLongPress }) => (
        <CalendarDayButton
          date={date as unknown as CalendarDayData}
          state={state as "selected" | "disabled" | "today" | ""}
          marking={marking as unknown as CalendarDayMarking}
          onPress={onPress as unknown as (date: CalendarDayData) => void}
          onLongPress={
            onLongPress as unknown as (date: CalendarDayData) => void
          }
        />
      )}
      {...props}
    />
  );
}
