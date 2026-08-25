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
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { getLocaleData, type LocaleInput } from "../utils/locale";
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
  marked?: boolean;
  dotColor?: string;
  dots?: Array<{ key?: string; color?: string }>;
}

export interface CalendarProps extends Omit<
  React.ComponentProps<typeof WixCalendar>,
  "current" | "markedDates"
> {
  style?: StyleProp<ViewStyle>;
  current?: string; // Controlled current date string (YYYY-MM-DD)
  markedDates?: Record<string, CalendarDayMarking>;
  enableYearMonthPicker?: boolean;
  showTodayButton?: boolean;
  locale?: LocaleInput;
  onTodayPress?: () => void;
}

interface CustomDayProps {
  date: CalendarDayData;
  state: "selected" | "disabled" | "today" | "";
  marking?: CalendarDayMarking;
  onPress: (date: CalendarDayData) => void;
  onLongPress: (date: CalendarDayData) => void;
}

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

export function CalendarArrow({
  direction,
  color,
}: {
  direction: "left" | "right";
  color?: string;
}) {
  const { colors, isDark } = useTheme();
  const arrowColor = color || colors.text;

  return (
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.07)"
          : "rgba(0, 0, 0, 0.05)",
      }}
    >
      {direction === "left" ? (
        <ChevronLeft color={arrowColor} />
      ) : (
        <ChevronRight color={arrowColor} />
      )}
    </View>
  );
}

export function CalendarDayButton({
  date,
  state,
  marking = {},
  onPress,
  onLongPress,
}: CustomDayProps) {
  const { colors, radii, isDark } = useTheme();

  const isSelected = marking.selected || state === "selected";
  const isStart = Boolean(marking.startingDay);
  const isEnd = Boolean(marking.endingDay);
  const isMiddle = Boolean(marking.isMiddle);
  const isToday = state === "today";
  const isDisabled = state === "disabled" || marking.disabled;

  const activeColor = marking.color || colors.primary;
  const activeTextColor = marking.textColor || colors.onPrimary;
  const middleBg = isDark ? "rgba(99, 102, 241, 0.28)" : colors.primarySoft;
  const middleTextColor = isDark ? colors.onPrimary : colors.primary;

  let textColor = colors.text;
  if (isDisabled) {
    textColor = colors.disabledText;
  } else if ((isStart || isEnd || isSelected) && !isMiddle) {
    textColor = activeTextColor;
  } else if (isMiddle) {
    textColor = marking.textColor || middleTextColor;
  } else if (isToday) {
    textColor = colors.primary;
  }

  return (
    <Pressable
      onPress={() => {
        if (!isDisabled && onPress) {
          triggerHaptic("selection");
          onPress(date);
        }
      }}
      onLongPress={() => {
        if (!isDisabled && onLongPress) {
          triggerHaptic("selection");
          onLongPress(date);
        }
      }}
      style={({ pressed }) => ({
        width: "100%",
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        opacity: isDisabled ? 0.35 : pressed ? 0.78 : 1,
      })}
    >
      {/* 1. Range connector strips */}
      {isMiddle && (
        <View
          style={{
            position: "absolute",
            top: 3,
            bottom: 3,
            left: 0,
            right: 0,
            backgroundColor: marking.color || middleBg,
          }}
        />
      )}
      {isStart && !isEnd && (
        <View
          style={{
            position: "absolute",
            top: 3,
            bottom: 3,
            left: "50%",
            right: 0,
            backgroundColor: middleBg,
          }}
        />
      )}
      {isEnd && !isStart && (
        <View
          style={{
            position: "absolute",
            top: 3,
            bottom: 3,
            left: 0,
            right: "50%",
            backgroundColor: middleBg,
          }}
        />
      )}

      {/* 2. Endpoint Circle (Start, End, Selected, or Today) */}
      {(isStart || isEnd || isSelected) ? (
        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: radii.full,
            backgroundColor: activeColor,
          }}
        />
      ) : isToday ? (
        <View
          style={{
            position: "absolute",
            width: 32,
            height: 32,
            borderRadius: radii.full,
            backgroundColor: colors.backgroundMuted,
            borderWidth: 1.5,
            borderColor: colors.primary,
          }}
        />
      ) : null}

      {/* Date text */}
      <Text
        style={{
          color: textColor,
          fontSize: 13,
          fontWeight: isStart || isEnd || isSelected || isToday ? "700" : "400",
          includeFontPadding: false,
          marginTop:
            marking.dots && marking.dots.length > 0 && (isStart || isEnd || isSelected || isToday)
              ? -4
              : 0,
        }}
      >
        {date.day}
      </Text>

      {/* Event Dots */}
      {marking.dots && marking.dots.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            gap: 2,
            position: "absolute",
            bottom: isStart || isEnd || isSelected || isToday ? 5 : 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {marking.dots.map((dot, idx) => (
            <View
              key={idx}
              style={{
                width: 3.5,
                height: 3.5,
                borderRadius: 2,
                backgroundColor:
                  isStart || isEnd || isSelected
                    ? colors.onPrimary
                    : dot.color || colors.primary,
              }}
            />
          ))}
        </View>
      ) : marking.marked ? (
        <View
          style={{
            position: "absolute",
            bottom: isStart || isEnd || isSelected || isToday ? 5 : 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor:
                isStart || isEnd || isSelected
                  ? colors.onPrimary
                  : marking.dotColor || colors.primary,
            }}
          />
        </View>
      ) : null}
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
  showTodayButton = true,
  locale,
  onTodayPress,
  ...props
}: CalendarProps) {
  const { colors, components, radii } = useTheme();
  const activeLocaleData = React.useMemo(
    () => getLocaleData(locale),
    [locale],
  );

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
    monthProgress.value = withTiming(showMonthSelector ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [monthProgress, showMonthSelector]);

  React.useEffect(() => {
    yearProgress.value = withTiming(showYearSelector ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
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
    triggerHaptic("selection");
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setCalendarKey((prev) => prev + 1);
  };

  const handleNextMonth = () => {
    triggerHaptic("selection");
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCalendarKey((prev) => prev + 1);
  };

  const handleTodayClick = () => {
    triggerHaptic("selection");
    const today = new Date();
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
    setCalendarKey((prev) => prev + 1);
    setShowMonthSelector(false);
    setShowYearSelector(false);
    onTodayPress?.();
  };

  const handleMonthChange = (dateData: CalendarDayData) => {
    setCurrentMonth(dateData.month);
    setCurrentYear(dateData.year);
    if (props.onMonthChange) {
      props.onMonthChange(dateData);
    }
  };

  const customTheme: React.ComponentProps<typeof WixCalendar>["theme"] = {
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
      {/* Custom header with month and year navigation */}
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
                  triggerHaptic("selection");
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
                  {activeLocaleData.monthNames[currentMonth - 1]}
                </Text>
              </Pressable>

              {/* Year Trigger */}
              <Pressable
                onPress={() => {
                  triggerHaptic("selection");
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
              {activeLocaleData.monthNames[currentMonth - 1]} {currentYear}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {showTodayButton && (
            <Pressable
              onPress={handleTodayClick}
              style={({ pressed }) => ({
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: radii.sm,
                backgroundColor: pressed
                  ? colors.backgroundMuted
                  : colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
              })}
            >
              <Text variant="caption" weight="600" color="primary">
                {activeLocaleData.today || "Today"}
              </Text>
            </Pressable>
          )}

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
          {activeLocaleData.monthNamesShort.map((m, idx) => {
            const isSel = currentMonth === idx + 1;
            return (
              <Pressable
                key={m}
                onPress={() => {
                  triggerHaptic("selection");
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
                  triggerHaptic("selection");
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
        markedDates={
          markedDates as unknown as React.ComponentProps<
            typeof WixCalendar
          >["markedDates"]
        }
        hideArrows={true}
        renderHeader={() => null}
        current={visibleMonthStr}
        onMonthChange={
          handleMonthChange as unknown as (date: CalendarDayData) => void
        }
        dayComponent={({ date, state, marking, onPress, onLongPress }) => (
          <CalendarDayButton
            date={date as unknown as CalendarDayData}
            state={state as "selected" | "disabled" | "today" | ""}
            marking={marking as unknown as CalendarDayMarking}
            onPress={(day) => {
              if (onPress) {
                onPress(day);
              }
              if (props.onDayPress) {
                props.onDayPress(day as unknown as React.ComponentProps<typeof WixCalendar>["onDayPress"] extends ((date: infer D) => void) | undefined ? D : never);
              }
            }}
            onLongPress={
              onLongPress as unknown as (date: CalendarDayData) => void
            }
          />
        )}
        {...props}
      />
    </View>
  );
}
