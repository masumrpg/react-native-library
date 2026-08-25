import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { getLocaleData, LocaleConfig, type LocaleInput } from "../utils/locale";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Text } from "./Text";

export type DatePickerVariant = "wheel" | "calendar";

export type DatePickerMode =
  | "date"
  | "time"
  | "datetime"
  | "month-year"
  | "year";

export type DatePickerOrder = ("year" | "month" | "day")[];

export type MonthFormat = "short" | "full" | "numeric";

export interface WheelPickerItem<T = string | number> {
  label: string;
  value: T;
}

export interface WheelPickerColumnProps<T = string | number> {
  items: WheelPickerItem<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  itemHeight?: number;
  visibleItems?: number;
  hapticFeedback?: boolean;
  hapticType?:
    | "light"
    | "medium"
    | "heavy"
    | "soft"
    | "rigid"
    | "selection";
  itemStyle?: StyleProp<TextStyle>;
  selectedItemStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(date: Date, is24Hour: boolean = true): string {
  const hours = date.getHours();
  const mins = String(date.getMinutes()).padStart(2, "0");

  if (is24Hour) {
    return `${String(hours).padStart(2, "0")}:${mins}`;
  }

  const isPM = hours >= 12;
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = isPM ? "PM" : "AM";
  return `${String(h12).padStart(2, "0")}:${mins} ${ampm}`;
}

interface AnimatedWheelItemProps {
  item: WheelPickerItem<unknown>;
  index: number;
  scrollY: SharedValue<number>;
  itemHeight: number;
  onPress: (index: number) => void;
  textColor: string;
  itemStyle?: StyleProp<TextStyle>;
  selectedItemStyle?: StyleProp<TextStyle>;
}

function AnimatedWheelItem({
  item,
  index,
  scrollY,
  itemHeight,
  onPress,
  textColor,
  itemStyle,
}: AnimatedWheelItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const itemPosition = index * itemHeight;
    const distance = Math.abs(scrollY.value - itemPosition);
    const normalizedDistance = distance / itemHeight;

    const opacity = interpolate(
      normalizedDistance,
      [0, 1, 2, 3],
      [1, 0.52, 0.24, 0.08],
      "clamp",
    );

    const scale = interpolate(
      normalizedDistance,
      [0, 1, 2],
      [1, 0.93, 0.85],
      "clamp",
    );

    const rotateX = `${interpolate(
      (scrollY.value - itemPosition) / itemHeight,
      [-2, -1, 0, 1, 2],
      [36, 18, 0, -18, -36],
      "clamp",
    )}deg`;

    return {
      opacity,
      transform: [
        { perspective: 600 },
        { rotateX },
        { scale },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onPress(index)}
      style={{
        height: itemHeight,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            {
              color: textColor,
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
            },
            itemStyle,
          ]}
        >
          {item.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Reanimated 60fps WheelPicker Column with precise drag & momentum snapping
 */
export function WheelPickerColumn<T = string | number>({
  items,
  selectedValue,
  onValueChange,
  itemHeight = 44,
  visibleItems = 5,
  hapticFeedback = true,
  hapticType = "selection",
  itemStyle,
  selectedItemStyle,
  style,
}: WheelPickerColumnProps<T>) {
  const { colors } = useTheme();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const containerHeight = itemHeight * visibleItems;
  const paddingCount = Math.floor(visibleItems / 2);
  const scrollY = useSharedValue(0);

  const selectedIndex = useMemo(() => {
    const idx = items.findIndex((it) => it.value === selectedValue);
    return idx >= 0 ? idx : 0;
  }, [items, selectedValue]);

  // Initial scroll position sync
  useEffect(() => {
    scrollY.value = selectedIndex * itemHeight;
    if (scrollRef.current && selectedIndex >= 0 && items.length > 0) {
      scrollRef.current.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false,
      });
    }
  }, [selectedIndex, itemHeight, items.length, scrollY]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

      if (items[clampedIndex] && items[clampedIndex].value !== selectedValue) {
        if (hapticFeedback) {
          triggerHaptic(hapticType);
        }
        onValueChange(items[clampedIndex].value);
      }
    },
    [hapticFeedback, hapticType, itemHeight, items, onValueChange, selectedValue],
  );

  const handleItemPress = useCallback(
    (index: number) => {
      scrollRef.current?.scrollTo({
        y: index * itemHeight,
        animated: true,
      });
      if (hapticFeedback) {
        triggerHaptic(hapticType);
      }
      if (items[index] && items[index].value !== selectedValue) {
        onValueChange(items[index].value);
      }
    },
    [hapticFeedback, hapticType, itemHeight, items, onValueChange, selectedValue],
  );

  return (
    <View
      style={[
        {
          height: containerHeight,
          flex: 1,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: selectedIndex * itemHeight }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: paddingCount * itemHeight,
        }}
      >
        {items.map((item, index) => (
          <AnimatedWheelItem
            key={`${item.value}-${index}`}
            item={item}
            index={index}
            scrollY={scrollY}
            itemHeight={itemHeight}
            onPress={handleItemPress}
            textColor={colors.text}
            itemStyle={itemStyle}
            selectedItemStyle={selectedItemStyle}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  variant?: DatePickerVariant;
  mode?: DatePickerMode;
  order?: DatePickerOrder;
  monthFormat?: MonthFormat;
  locale?: LocaleInput;
  is24Hour?: boolean;
  startYear?: number;
  endYear?: number;
  minuteInterval?: number;
  itemHeight?: number;
  visibleItems?: number;
  highlightColor?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Universal DatePicker supporting 'wheel' and 'calendar' variants, 12h AM/PM & 24h modes, and localization
 */
export function DatePicker({
  value,
  onChange,
  variant = "wheel",
  mode = "date",
  order = ["year", "month", "day"],
  monthFormat = "short",
  locale,
  is24Hour = true,
  startYear = 1940,
  endYear = new Date().getFullYear() + 10,
  minuteInterval = 1,
  itemHeight = 44,
  visibleItems = 5,
  highlightColor,
  style,
}: DatePickerProps) {
  const { colors, radii, spacing } = useTheme();
  const localeData = useMemo(() => getLocaleData(locale), [locale]);

  const currentDate = useMemo(() => value ?? new Date(), [value]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // 12-hour AM/PM calculations
  const isPM = hours >= 12;
  const current12Hour = hours % 12 === 0 ? 12 : hours % 12;
  const currentAmPm = isPM ? "PM" : "AM";

  // Year items
  const yearItems = useMemo<WheelPickerItem<number>[]>(() => {
    const list: WheelPickerItem<number>[] = [];
    for (let y = startYear; y <= endYear; y++) {
      list.push({ label: String(y), value: y });
    }
    return list;
  }, [startYear, endYear]);

  // Month items localized
  const monthItems = useMemo<WheelPickerItem<number>[]>(() => {
    return Array.from({ length: 12 }, (_, i) => {
      let label = String(i + 1).padStart(2, "0");
      if (monthFormat === "short") {
        label = localeData.monthNamesShort[i] || String(i + 1);
      }
      if (monthFormat === "full") {
        label = localeData.monthNames[i] || String(i + 1);
      }
      return { label, value: i };
    });
  }, [monthFormat, localeData]);

  // Day items dynamically calculated based on year & month
  const dayItems = useMemo<WheelPickerItem<number>[]>(() => {
    const maxDays = getDaysInMonth(year, month);
    return Array.from({ length: maxDays }, (_, i) => {
      const d = i + 1;
      return { label: String(d).padStart(2, "0"), value: d };
    });
  }, [year, month]);

  // 24-hour items (00 - 23)
  const hour24Items = useMemo<WheelPickerItem<number>[]>(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      label: String(i).padStart(2, "0"),
      value: i,
    }));
  }, []);

  // 12-hour items (01 - 12)
  const hour12Items = useMemo<WheelPickerItem<number>[]>(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const h = i + 1;
      return {
        label: String(h).padStart(2, "0"),
        value: h,
      };
    });
  }, []);

  // AM / PM items
  const amPmItems = useMemo<WheelPickerItem<string>[]>(
    () => [
      { label: "AM", value: "AM" },
      { label: "PM", value: "PM" },
    ],
    [],
  );

  // Minutes items (00 - 59)
  const minuteItems = useMemo<WheelPickerItem<number>[]>(() => {
    const list: WheelPickerItem<number>[] = [];
    for (let m = 0; m < 60; m += minuteInterval) {
      list.push({
        label: String(m).padStart(2, "0"),
        value: m,
      });
    }
    return list;
  }, [minuteInterval]);

  const handleYearChange = useCallback(
    (newYear: number) => {
      const maxDays = getDaysInMonth(newYear, month);
      const safeDay = Math.min(day, maxDays);
      const nextDate = new Date(newYear, month, safeDay, hours, minutes);
      onChange?.(nextDate);
    },
    [day, hours, minutes, month, onChange],
  );

  const handleMonthChange = useCallback(
    (newMonth: number) => {
      const maxDays = getDaysInMonth(year, newMonth);
      const safeDay = Math.min(day, maxDays);
      const nextDate = new Date(year, newMonth, safeDay, hours, minutes);
      onChange?.(nextDate);
    },
    [day, hours, minutes, onChange, year],
  );

  const handleDayChange = useCallback(
    (newDay: number) => {
      const nextDate = new Date(year, month, newDay, hours, minutes);
      onChange?.(nextDate);
    },
    [hours, minutes, month, onChange, year],
  );

  const handle24HourChange = useCallback(
    (newHour: number) => {
      const nextDate = new Date(year, month, day, newHour, minutes);
      onChange?.(nextDate);
    },
    [day, minutes, month, onChange, year],
  );

  const handle12HourChange = useCallback(
    (new12Hour: number) => {
      let new24Hour: number;
      if (isPM) {
        new24Hour = new12Hour === 12 ? 12 : new12Hour + 12;
      } else {
        new24Hour = new12Hour === 12 ? 0 : new12Hour;
      }
      const nextDate = new Date(year, month, day, new24Hour, minutes);
      onChange?.(nextDate);
    },
    [day, isPM, minutes, month, onChange, year],
  );

  const handleAmPmChange = useCallback(
    (newAmPm: string) => {
      let new24Hour = hours;
      if (newAmPm === "PM" && hours < 12) {
        new24Hour = hours + 12;
      } else if (newAmPm === "AM" && hours >= 12) {
        new24Hour = hours - 12;
      }
      const nextDate = new Date(year, month, day, new24Hour, minutes);
      onChange?.(nextDate);
    },
    [day, hours, minutes, month, onChange, year],
  );

  const handleMinuteChange = useCallback(
    (newMinute: number) => {
      const nextDate = new Date(year, month, day, hours, newMinute);
      onChange?.(nextDate);
    },
    [day, hours, month, onChange, year],
  );

  const renderDateColumn = (col: "year" | "month" | "day") => {
    if (col === "year") {
      return (
        <WheelPickerColumn
          key="year"
          items={yearItems}
          selectedValue={year}
          onValueChange={handleYearChange}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
        />
      );
    }
    if (col === "month") {
      return (
        <WheelPickerColumn
          key="month"
          items={monthItems}
          selectedValue={month}
          onValueChange={handleMonthChange}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
        />
      );
    }
    return (
      <WheelPickerColumn
        key="day"
        items={dayItems}
        selectedValue={day}
        onValueChange={handleDayChange}
        itemHeight={itemHeight}
        visibleItems={visibleItems}
      />
    );
  };

  // Calendar Grid Mode
  if (variant === "calendar" && mode !== "time") {
    const isoString = formatDateToIso(currentDate);

    return (
      <View style={[{ width: "100%", gap: spacing.md }, style]}>
        <Calendar
          key={`${isoString}-${typeof locale === "string" ? locale : "default"}`}
          current={isoString}
          locale={locale}
          markedDates={{
            [isoString]: {
              selected: true,
              color: colors.primary,
              textColor: "#FFFFFF",
            },
          }}
          onDayPress={(dayData) => {
            triggerHaptic("selection");
            const next = new Date(dayData.year, dayData.month - 1, dayData.day, hours, minutes);
            onChange?.(next);
          }}
        />

        {/* If datetime mode, also show time wheel underneath */}
        {mode === "datetime" && (
          <View
            style={{
              paddingTop: spacing.xs,
              borderTopWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.textMuted,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              TIME SELECTION {is24Hour ? "(24H)" : "(12H AM/PM)"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 100,
              }}
            >
              {is24Hour ? (
                <WheelPickerColumn
                  items={hour24Items}
                  selectedValue={hours}
                  onValueChange={handle24HourChange}
                  itemHeight={34}
                  visibleItems={3}
                />
              ) : (
                <WheelPickerColumn
                  items={hour12Items}
                  selectedValue={current12Hour}
                  onValueChange={handle12HourChange}
                  itemHeight={34}
                  visibleItems={3}
                />
              )}

              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "700",
                  marginHorizontal: 4,
                }}
              >
                :
              </Text>

              <WheelPickerColumn
                items={minuteItems}
                selectedValue={minutes}
                onValueChange={handleMinuteChange}
                itemHeight={34}
                visibleItems={3}
              />

              {!is24Hour && (
                <WheelPickerColumn
                  items={amPmItems}
                  selectedValue={currentAmPm}
                  onValueChange={handleAmPmChange}
                  itemHeight={34}
                  visibleItems={3}
                  style={{ maxWidth: 70 }}
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  // Wheel Roller Mode (or pure time mode)
  const containerHeight = itemHeight * visibleItems;

  return (
    <View
      style={[
        {
          position: "relative",
          height: containerHeight,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {/* Center Highlight Selection Bar */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: (containerHeight - itemHeight) / 2,
          left: 8,
          right: 8,
          height: itemHeight,
          borderRadius: radii.md,
          backgroundColor:
            highlightColor ??
            (colors.surfaceRaised
              ? colors.surfaceRaised
              : "rgba(128, 128, 128, 0.12)"),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          zIndex: 0,
        }}
      />

      {/* Date columns */}
      {mode === "date" && order.map((col) => renderDateColumn(col))}

      {mode === "month-year" && (
        <>
          {renderDateColumn("month")}
          {renderDateColumn("year")}
        </>
      )}

      {mode === "year" && renderDateColumn("year")}

      {/* Pure Time mode (24h or 12h AM/PM) */}
      {mode === "time" && (
        <>
          {is24Hour ? (
            <WheelPickerColumn
              key="hours-24"
              items={hour24Items}
              selectedValue={hours}
              onValueChange={handle24HourChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          ) : (
            <WheelPickerColumn
              key="hours-12"
              items={hour12Items}
              selectedValue={current12Hour}
              onValueChange={handle12HourChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          )}

          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "700",
              marginHorizontal: 4,
              zIndex: 2,
            }}
          >
            :
          </Text>

          <WheelPickerColumn
            key="minutes"
            items={minuteItems}
            selectedValue={minutes}
            onValueChange={handleMinuteChange}
            itemHeight={itemHeight}
            visibleItems={visibleItems}
          />

          {!is24Hour && (
            <WheelPickerColumn
              key="ampm"
              items={amPmItems}
              selectedValue={currentAmPm}
              onValueChange={handleAmPmChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
              style={{ maxWidth: 85 }}
            />
          )}
        </>
      )}

      {/* DateTime columns */}
      {mode === "datetime" && (
        <>
          {renderDateColumn("month")}
          {renderDateColumn("day")}
          {renderDateColumn("year")}
          <View
            style={{
              width: 1,
              height: containerHeight * 0.7,
              backgroundColor: colors.border,
              marginHorizontal: 4,
            }}
          />

          {is24Hour ? (
            <WheelPickerColumn
              key="hours-24"
              items={hour24Items}
              selectedValue={hours}
              onValueChange={handle24HourChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          ) : (
            <WheelPickerColumn
              key="hours-12"
              items={hour12Items}
              selectedValue={current12Hour}
              onValueChange={handle12HourChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          )}

          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "700",
              marginHorizontal: 2,
              zIndex: 2,
            }}
          >
            :
          </Text>

          <WheelPickerColumn
            key="minutes"
            items={minuteItems}
            selectedValue={minutes}
            onValueChange={handleMinuteChange}
            itemHeight={itemHeight}
            visibleItems={visibleItems}
          />

          {!is24Hour && (
            <WheelPickerColumn
              key="ampm"
              items={amPmItems}
              selectedValue={currentAmPm}
              onValueChange={handleAmPmChange}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
              style={{ maxWidth: 70 }}
            />
          )}
        </>
      )}
    </View>
  );
}

export interface DatePickerCardProps extends DatePickerProps {
  title?: string;
  onClose?: () => void;
  onConfirm?: (date: Date) => void;
  confirmText?: string;
  showVariantToggle?: boolean;
  locale?: LocaleInput;
  is24Hour?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
}

/**
 * Self-contained card layout with built-in Wheel vs Calendar switcher, 12h/24h time, & locale support
 */
export function DatePickerCard({
  title,
  value,
  onChange,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  variant = "wheel",
  showVariantToggle = true,
  locale,
  is24Hour = true,
  mode = "date",
  order = ["year", "month", "day"],
  cardStyle,
  ...props
}: DatePickerCardProps) {
  const { colors, radii, spacing } = useTheme();
  const localeData = useMemo(() => getLocaleData(locale), [locale]);
  const [internalDate, setInternalDate] = useState(() => value ?? new Date());
  const [currentVariant, setCurrentVariant] = useState<DatePickerVariant>(
    variant ?? "wheel",
  );

  const defaultTitle = useMemo(() => {
    if (title) return title;
    if (mode === "time") return "SET TIME";
    if (mode === "datetime") return "SET SCHEDULE";
    if (mode === "month-year") return "SET EXPIRATION";
    return "SET BIRTHDAY";
  }, [title, mode]);

  useEffect(() => {
    if (value) {
      setInternalDate(value);
    }
  }, [value]);

  useEffect(() => {
    if (variant) {
      setCurrentVariant(variant);
    }
  }, [variant]);

  const handleChange = (d: Date) => {
    setInternalDate(d);
    onChange?.(d);
  };

  const handleConfirm = () => {
    triggerHaptic("selection");
    onConfirm?.(internalDate);
  };

  return (
    <View
      style={[
        {
          width: "100%",
          maxWidth: 360,
          borderRadius: radii.xl ?? 24,
          backgroundColor: colors.surfaceRaised ?? colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.lg,
          gap: spacing.md,
          alignSelf: "center",
        },
        cardStyle,
      ]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: spacing.xs,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: colors.text,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {defaultTitle}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Wheel vs Calendar Live Switcher */}
          {showVariantToggle && mode !== "time" && (
            <View
              style={{
                flexDirection: "row",
                backgroundColor: colors.backgroundMuted,
                borderRadius: radii.full,
                padding: 2,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              }}
            >
              <Pressable
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentVariant("wheel");
                }}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radii.full,
                  backgroundColor:
                    currentVariant === "wheel"
                      ? colors.primary
                      : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color:
                      currentVariant === "wheel"
                        ? "#FFFFFF"
                        : colors.textMuted,
                  }}
                >
                  Wheel
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  triggerHaptic("selection");
                  setCurrentVariant("calendar");
                }}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radii.full,
                  backgroundColor:
                    currentVariant === "calendar"
                      ? colors.primary
                      : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color:
                      currentVariant === "calendar"
                        ? "#FFFFFF"
                        : colors.textMuted,
                  }}
                >
                  Calendar
                </Text>
              </Pressable>
            </View>
          )}

          {onClose && (
            <Pressable
              onPress={() => {
                triggerHaptic("selection");
                onClose();
              }}
              hitSlop={8}
              style={{
                padding: 4,
                borderRadius: radii.full,
              }}
            >
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.textMuted}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M18 6L6 18M6 6l12 12" />
              </Svg>
            </Pressable>
          )}
        </View>
      </View>

      {/* DatePicker */}
      <DatePicker
        value={internalDate}
        onChange={handleChange}
        variant={currentVariant}
        locale={locale}
        is24Hour={is24Hour}
        mode={mode}
        order={order}
        {...props}
      />

      {/* Selected Date/Time Summary Display */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.backgroundMuted,
          borderRadius: radii.md,
          paddingVertical: 7,
          paddingHorizontal: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          gap: 6,
        }}
      >
        <Svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {mode === "time" ? (
            <>
              <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <Path d="M12 6v6l4 2" />
            </>
          ) : (
            <>
              <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              <Path d="M16 2v4M8 2v4M3 10h18" />
            </>
          )}
        </Svg>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.text,
            textAlign: "center",
          }}
        >
          {(() => {
            const dName = localeData.dayNames[internalDate.getDay()];
            const day = internalDate.getDate();
            const month = localeData.monthNames[internalDate.getMonth()];
            const year = internalDate.getFullYear();
            const timeStr = formatTime(internalDate, is24Hour);

            if (mode === "time") {
              return timeStr;
            }
            if (mode === "datetime") {
              return `${dName}, ${day} ${month} ${year} • ${timeStr}`;
            }
            if (mode === "month-year") {
              return `${month} ${year}`;
            }
            if (mode === "year") {
              return `${year}`;
            }
            return `${dName}, ${day} ${month} ${year}`;
          })()}
        </Text>
      </View>

      {/* Submit Button */}
      <Button
        variant="filled"
        tone="primary"
        size="lg"
        fullWidth
        style={{
          borderRadius: radii.xl,
          marginTop: spacing.xs,
        }}
        onPress={handleConfirm}
      >
        {confirmText}
      </Button>
    </View>
  );
}

export interface DatePickerModalProps extends DatePickerCardProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Modal dialog displaying the DatePickerCard without touch responder interception
 */
export function DatePickerModal({
  visible,
  onClose,
  ...props
}: DatePickerModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Background Dim Overlay */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          />
        </Pressable>

        {/* Modal Card Content (Native View ensures 100% responsive calendar & button taps) */}
        <View style={{ width: "100%", maxWidth: 360, zIndex: 10 }}>
          <DatePickerCard key={String(visible)} onClose={onClose} {...props} />
        </View>
      </View>
    </Modal>
  );
}

// Dialog alias
export const DatePickerDialog = DatePickerModal;

export interface DatePickerInputProps {
  value?: Date;
  onChange?: (date: Date) => void;
  variant?: DatePickerVariant;
  showVariantToggle?: boolean;
  showDayOfWeek?: boolean;
  locale?: LocaleInput;
  is24Hour?: boolean;
  placeholder?: string;
  label?: string;
  title?: string;
  mode?: DatePickerMode;
  order?: DatePickerOrder;
  monthFormat?: MonthFormat;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Trigger field that opens DatePickerModal / DatePickerDialog with locale & 12h/24h time support
 */
export function DatePickerInput({
  value,
  onChange,
  variant = "wheel",
  showVariantToggle = true,
  showDayOfWeek = true,
  locale,
  is24Hour = true,
  placeholder,
  title,
  mode = "date",
  order = ["year", "month", "day"],
  monthFormat = "full",
  disabled,
  style,
}: DatePickerInputProps) {
  const { colors, radii, spacing } = useTheme();
  const localeData = useMemo(() => getLocaleData(locale), [locale]);
  const [open, setOpen] = useState(false);

  const defaultPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    if (mode === "time") return "Select time";
    if (mode === "datetime") return "Select date & time";
    if (mode === "month-year") return "Select month & year";
    return "Select date";
  }, [placeholder, mode]);

  const defaultTitle = useMemo(() => {
    if (title) return title;
    if (mode === "time") return "SET TIME";
    if (mode === "datetime") return "SET SCHEDULE";
    if (mode === "month-year") return "SET EXPIRATION";
    return "SET BIRTHDAY";
  }, [title, mode]);

  const formattedValue = useMemo(() => {
    if (!value) return "";
    const dName = localeData.dayNames[value.getDay()];
    const y = value.getFullYear();
    const m =
      monthFormat === "short"
        ? localeData.monthNamesShort[value.getMonth()]
        : monthFormat === "full"
        ? localeData.monthNames[value.getMonth()]
        : String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    const timeStr = formatTime(value, is24Hour);

    const prefix = showDayOfWeek ? `${dName}, ` : "";

    if (mode === "date") {
      return `${prefix}${d} ${m} ${y}`;
    }
    if (mode === "time") {
      return timeStr;
    }
    if (mode === "datetime") {
      return `${prefix}${d} ${m} ${y} • ${timeStr}`;
    }
    if (mode === "month-year") {
      return `${m} ${y}`;
    }
    return String(y);
  }, [value, mode, monthFormat, showDayOfWeek, localeData, is24Hour]);

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={() => {
          triggerHaptic("selection");
          setOpen(true);
        }}
        style={[
          {
            height: 48,
            width: "100%",
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <Text
          style={{
            fontSize: 15,
            color: formattedValue ? colors.text : colors.textMuted,
          }}
        >
          {formattedValue || defaultPlaceholder}
        </Text>

        {/* Calendar / Clock Icon */}
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {mode === "time" ? (
            <>
              <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <Path d="M12 6v6l4 2" />
            </>
          ) : (
            <>
              <Path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              <Path d="M16 2v4M8 2v4M3 10h18" />
            </>
          )}
        </Svg>
      </Pressable>

      <DatePickerModal
        visible={open}
        title={defaultTitle}
        variant={variant}
        showVariantToggle={showVariantToggle}
        locale={locale}
        is24Hour={is24Hour}
        mode={mode}
        order={order}
        value={value}
        onClose={() => setOpen(false)}
        onConfirm={(selected) => {
          onChange?.(selected);
          setOpen(false);
        }}
      />
    </>
  );
}

/**
 * Dedicated TimePicker Component (mode="time") with 24h & 12h AM/PM support
 */
export function TimePicker(props: Omit<DatePickerProps, "mode">) {
  return <DatePicker mode="time" {...props} />;
}

/**
 * Dedicated TimePickerCard Component (mode="time") with 24h & 12h AM/PM support
 */
export function TimePickerCard(props: Omit<DatePickerCardProps, "mode">) {
  return <DatePickerCard mode="time" {...props} />;
}

/**
 * Dedicated TimePickerModal Component (mode="time") with 24h & 12h AM/PM support
 */
export function TimePickerModal(props: Omit<DatePickerModalProps, "mode">) {
  return <DatePickerModal mode="time" {...props} />;
}

export const TimePickerDialog = TimePickerModal;

/**
 * Dedicated TimePickerInput Component (mode="time") with 24h & 12h AM/PM support
 */
export function TimePickerInput(props: Omit<DatePickerInputProps, "mode">) {
  return <DatePickerInput mode="time" {...props} />;
}

export { LocaleConfig, getLocaleData, type LocaleInput };
