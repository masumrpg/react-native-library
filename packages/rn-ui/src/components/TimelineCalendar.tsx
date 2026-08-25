import React from "react";
import {
  CalendarUtils,
  Timeline as WixTimeline,
  TimelineList as WixTimelineList,
  type TimelineEventProps,
  type TimelineListProps,
  type TimelineListRenderItemInfo,
  type TimelinePackedEventProps,
  type TimelineProps as WixTimelineProps,
} from "react-native-calendars";
import { useTheme } from "../theme";

export {
  CalendarUtils,
  type TimelineEventProps,
  type TimelinePackedEventProps,
  type TimelineListProps,
  type TimelineListRenderItemInfo,
  type WixTimelineProps as TimelineCalendarProps,
};

export function TimelineCalendar({
  theme,
  styles,
  renderEvent,
  unavailableHoursColor,
  ...props
}: WixTimelineProps) {
  const { colors, isDark, radii } = useTheme();

  const resolvedUnavailableColor =
    unavailableHoursColor ||
    (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)");

  const customTheme = {
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textMuted,
    lineColor: colors.border,
    timeLabelColor: colors.textMuted,
    nowIndicatorColor: colors.danger,
    eventTitleColor: "#FFFFFF",
    eventSummaryColor: "rgba(255, 255, 255, 0.9)",
    eventTimesColor: "rgba(255, 255, 255, 0.75)",
    unavailableHoursColor: resolvedUnavailableColor,
    unavailableHoursBlock: {
      backgroundColor: resolvedUnavailableColor,
    },
    event: {
      borderRadius: radii.lg,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 0,
    },
    eventTitle: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 12.5,
    },
    eventSummary: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 11,
      marginTop: 2,
    },
    eventTimes: {
      color: "rgba(255, 255, 255, 0.75)",
      fontSize: 10,
      fontWeight: "600",
      marginTop: 2,
    },
    ...theme,
  };

  return (
    <WixTimeline
      theme={customTheme}
      styles={styles}
      renderEvent={renderEvent}
      unavailableHoursColor={resolvedUnavailableColor}
      {...props}
    />
  );
}

export function TimelineList({
  timelineProps,
  renderItem,
  ...props
}: TimelineListProps) {
  const { colors, isDark, radii } = useTheme();

  const resolvedUnavailableColor =
    timelineProps?.unavailableHoursColor ||
    (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)");

  const customTimelineProps = {
    ...timelineProps,
    unavailableHoursColor: resolvedUnavailableColor,
    theme: {
      calendarBackground: colors.surface,
      textSectionTitleColor: colors.textMuted,
      lineColor: colors.border,
      timeLabelColor: colors.textMuted,
      nowIndicatorColor: colors.danger,
      eventTitleColor: "#FFFFFF",
      eventSummaryColor: "rgba(255, 255, 255, 0.9)",
      eventTimesColor: "rgba(255, 255, 255, 0.75)",
      unavailableHoursColor: resolvedUnavailableColor,
      unavailableHoursBlock: {
        backgroundColor: resolvedUnavailableColor,
      },
      event: {
        borderRadius: radii.lg,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 0,
      },
      eventTitle: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 12.5,
      },
      eventSummary: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 11,
        marginTop: 2,
      },
      eventTimes: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
      },
      ...timelineProps?.theme,
    },
  };

  const defaultRenderItem = (
    itemProps: WixTimelineProps,
    info: TimelineListRenderItemInfo,
  ) => {
    if (renderItem) {
      return renderItem(itemProps, info);
    }
    const { key: _k, ...rest } = (itemProps as unknown || {}) as Record<
      string,
      unknown
    >;
    return (
      <TimelineCalendar
        key={info.item}
        {...(rest as unknown as WixTimelineProps)}
      />
    );
  };

  return (
    <WixTimelineList
      timelineProps={customTimelineProps}
      renderItem={
        defaultRenderItem as unknown as TimelineListProps["renderItem"]
      }
      {...props}
    />
  );
}
