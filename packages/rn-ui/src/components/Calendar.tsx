import React from "react";
import {
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Calendar as WixCalendar } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { Text } from "./Text";

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

export interface CalendarProps extends Omit<
  React.ComponentProps<typeof WixCalendar>,
  "current"
> {
  style?: StyleProp<ViewStyle>;
  current?: string; // Controlled current date string (YYYY-MM-DD)
  enableYearMonthPicker?: boolean;
}

interface CustomDayProps {
  date: CalendarDayData;
  state: "selected" | "disabled" | "today" | "";
  marking?: CalendarDayMarking;
  onPress: (date: CalendarDayData) => void;
  onLongPress: (date: CalendarDayData) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORTS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Pure component chevrons to avoid external icon dependencies
function ChevronLeft({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderLeftWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
        marginRight: -2,
      }}
    />
  );
}

function ChevronRight({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRightWidth: 1.5,
        borderTopWidth: 1.5,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
        marginLeft: -2,
      }}
    />
  );
}

function CalendarDayButton({
  date,
  state,
  marking = {},
  onPress,
  onLongPress,
}: CustomDayProps) {
  const { colors, radii } = useTheme();

  const isSelected = marking.selected || state === "selected";
  const isStart = marking.startingDay;
  const isEnd = marking.endingDay;
  const isMiddle = marking.isMiddle;
  const isToday = state === "today";
  const isDisabled = state === "disabled" || marking.disabled;

  const cellStyle: ViewStyle = {
    aspectRatio: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1,
  };

  let bg = "transparent";
  let textColor = colors.text;
  let borderTopLeftRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomRightRadius = 0;

  if (isStart) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopLeftRadius = radii.md;
    borderBottomLeftRadius = radii.md;
  } else if (isEnd) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopRightRadius = radii.md;
    borderBottomRightRadius = radii.md;
  } else if (isMiddle) {
    bg = colors.backgroundMuted;
    textColor = colors.primary;
  } else if (isSelected) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopLeftRadius = radii.full;
    borderBottomLeftRadius = radii.full;
    borderTopRightRadius = radii.full;
    borderBottomRightRadius = radii.full;
  } else if (isToday) {
    bg = colors.backgroundMuted;
    textColor = colors.text;
    borderTopLeftRadius = radii.full;
    borderBottomLeftRadius = radii.full;
    borderTopRightRadius = radii.full;
    borderBottomRightRadius = radii.full;
  }

  if (isDisabled) {
    textColor = colors.disabledText;
  }

  return (
    <Pressable
      onPress={() => !isDisabled && onPress && onPress(date)}
      onLongPress={() => !isDisabled && onLongPress && onLongPress(date)}
      style={({ pressed }) => [
        cellStyle,
        {
          backgroundColor: bg,
          borderTopLeftRadius,
          borderBottomLeftRadius,
          borderTopRightRadius,
          borderBottomRightRadius,
          opacity: pressed && !isDisabled ? 0.78 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontSize: 14,
          fontWeight: isSelected || isToday ? "600" : "400",
        }}
      >
        {date.day}
      </Text>
    </Pressable>
  );
}

export function Calendar({
  style,
  theme,
  markingType = "period",
  markedDates,
  current,
  enableYearMonthPicker = true,
  ...props
}: CalendarProps) {
  const { colors, components, radii } = useTheme();

  // Parsing initial month/year
  const initialDate = current ? new Date(current) : new Date();
  const [currentMonth, setCurrentMonth] = React.useState(
    initialDate.getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = React.useState(
    initialDate.getFullYear(),
  );

  const [showMonthSelector, setShowMonthSelector] = React.useState(false);
  const [showYearSelector, setShowYearSelector] = React.useState(false);
  const [overlayHeight, setOverlayHeight] = React.useState(260);
  const [calendarKey, setCalendarKey] = React.useState(0);

  const monthProgress = useSharedValue(showMonthSelector ? 1 : 0);
  const yearProgress = useSharedValue(showYearSelector ? 1 : 0);

  React.useEffect(() => {
    monthProgress.value = withSpring(showMonthSelector ? 1 : 0, {
      damping: 16,
      stiffness: 180,
    });
  }, [monthProgress, showMonthSelector]);

  React.useEffect(() => {
    yearProgress.value = withSpring(showYearSelector ? 1 : 0, {
      damping: 16,
      stiffness: 180,
    });
  }, [showYearSelector, yearProgress]);

  const monthOverlayStyle = useAnimatedStyle(() => ({
    opacity: monthProgress.value,
    transform: [{ translateY: -600 * (1 - monthProgress.value) }],
  }));

  const yearOverlayStyle = useAnimatedStyle(() => ({
    opacity: yearProgress.value,
    transform: [{ translateY: -600 * (1 - yearProgress.value) }],
  }));

  // Sync visible date when controlled 'current' prop changes
  React.useEffect(() => {
    if (current) {
      const d = new Date(current);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d.getMonth() + 1);
        setCurrentYear(d.getFullYear());
        setCalendarKey((prev) => prev + 1);
      }
    }
  }, [current]);

  const visibleMonthStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setCalendarKey((prev) => prev + 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCalendarKey((prev) => prev + 1);
  };

  const handleMonthChange = (dateData: any) => {
    setCurrentMonth(dateData.month);
    setCurrentYear(dateData.year);
    if (props.onMonthChange) {
      props.onMonthChange(dateData);
    }
  };

  const customTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontWeight: "600",
    textMonthFontSize: 16,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500",
    arrowColor: colors.text,
    disabledArrowColor: colors.disabledText,
    ...theme,
  };

  // Generate years: from 100 years ago to 10 years ahead
  const endYear = new Date().getFullYear() + 5;
  const startYear = endYear - 100;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i,
  );

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          borderWidth: components.borderWidth.strong,
          borderColor: colors.border,
          overflow: "hidden",
          position: "relative",
        },
        style,
      ]}
    >
      {/* Custom header with month and year navigation. */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        <Pressable
          onPress={handlePrevMonth}
          style={({ pressed }) => ({
            padding: 8,
            borderRadius: radii.md,
            backgroundColor: pressed
              ? colors.backgroundMuted
              : colors.transparent,
          })}
        >
          <ChevronLeft color={colors.text} />
        </Pressable>

        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          {enableYearMonthPicker ? (
            <>
              {/* Month Trigger */}
              <Pressable
                onPress={() => {
                  setShowMonthSelector(!showMonthSelector);
                  setShowYearSelector(false);
                }}
                style={({ pressed }) => ({
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: radii.md,
                  backgroundColor: showMonthSelector
                    ? colors.backgroundMuted
                    : pressed
                      ? colors.backgroundMuted
                      : colors.transparent,
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {MONTHS[currentMonth - 1]}
                </Text>
              </Pressable>

              {/* Year Trigger */}
              <Pressable
                onPress={() => {
                  setShowYearSelector(!showYearSelector);
                  setShowMonthSelector(false);
                }}
                style={({ pressed }) => ({
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: radii.md,
                  backgroundColor: showYearSelector
                    ? colors.backgroundMuted
                    : pressed
                      ? colors.backgroundMuted
                      : colors.transparent,
                })}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  {currentYear}
                </Text>
              </Pressable>
            </>
          ) : (
            <Text
              style={{ fontSize: 15, fontWeight: "600", color: colors.text }}
            >
              {MONTHS[currentMonth - 1]} {currentYear}
            </Text>
          )}
        </View>

        <Pressable
          onPress={handleNextMonth}
          style={({ pressed }) => ({
            padding: 8,
            borderRadius: radii.md,
            backgroundColor: pressed
              ? colors.backgroundMuted
              : colors.transparent,
          })}
        >
          <ChevronRight color={colors.text} />
        </Pressable>
      </View>

      {/* Animated Month Fast Selector Overlay */}
      <Animated.View
        pointerEvents={showMonthSelector ? "auto" : "none"}
        style={[
          {
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surface,
            zIndex: 30,
            padding: 16,
            justifyContent: "center",
          },
          monthOverlayStyle,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {MONTH_SHORTS.map((m, idx) => {
            const isSel = currentMonth === idx + 1;
            return (
              <Pressable
                key={m}
                onPress={() => {
                  setCurrentMonth(idx + 1);
                  setShowMonthSelector(false);
                  setCalendarKey((prev) => prev + 1);
                }}
                style={({ pressed }) => ({
                  width: "30%",
                  margin: 4,
                  paddingVertical: 12,
                  borderRadius: radii.md,
                  backgroundColor: isSel ? colors.primary : colors.transparent,
                  borderWidth: components.borderWidth.strong,
                  borderColor: isSel ? colors.primary : colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.78 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: isSel ? "600" : "400",
                    color: isSel ? colors.onPrimary : colors.text,
                  }}
                >
                  {m}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Animated Year Fast Selector Overlay */}
      <Animated.View
        pointerEvents={showYearSelector ? "auto" : "none"}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout;
          if (height > 0) {
            setOverlayHeight(height);
          }
        }}
        style={[
          {
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surface,
            zIndex: 30,
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
          },
          yearOverlayStyle,
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: "100%", height: "100%" }}
          contentContainerStyle={{
            flexDirection: "column",
            flexWrap: "wrap",
            height: overlayHeight - 24,
            paddingHorizontal: 8,
            paddingVertical: 12,
          }}
        >
          {years.map((y) => {
            const isSel = currentYear === y;
            return (
              <Pressable
                key={y}
                onPress={() => {
                  setCurrentYear(y);
                  setShowYearSelector(false);
                  setCalendarKey((prev) => prev + 1);
                }}
                style={({ pressed }) => ({
                  width: 75,
                  height: 42,
                  margin: 4,
                  borderRadius: radii.md,
                  backgroundColor: isSel ? colors.primary : colors.transparent,
                  borderWidth: components.borderWidth.strong,
                  borderColor: isSel ? colors.primary : colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.78 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: isSel ? "600" : "400",
                    color: isSel ? colors.onPrimary : colors.text,
                  }}
                >
                  {y}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      <WixCalendar
        key={`wix-cal-${calendarKey}`}
        style={{ padding: 8 }}
        theme={customTheme}
        markingType={markingType}
        markedDates={markedDates}
        hideArrows={true}
        renderHeader={() => null}
        current={visibleMonthStr}
        onMonthChange={handleMonthChange}
        dayComponent={({ date, state, marking, onPress, onLongPress }: any) => (
          <CalendarDayButton
            date={date}
            state={state}
            marking={marking}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        )}
        {...props}
      />
    </View>
  );
}
