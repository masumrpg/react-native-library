import {
  CalendarProvider,

  ExpandableCalendar,
  TimelineList,
  useTheme,
  useToast,
  type TimelineEventProps,
  type TimelineCalendarProps,
} from "@masumdev/rn-ui";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SystemUIOverlay } from "../../components/system-ui-overlay";

function getSampleDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

export default function TimelineCalendarScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const toast = useToast();

  const todayStr = useMemo(() => getSampleDate(0), []);
  const dayMinus1 = useMemo(() => getSampleDate(-1), []);
  const dayPlus1 = useMemo(() => getSampleDate(1), []);
  const dayPlus2 = useMemo(() => getSampleDate(2), []);

  const [currentDate, setCurrentDate] = useState<string>(todayStr);

  const initialEvents: Record<string, TimelineEventProps[]> = useMemo(() => {
    return {
      [dayMinus1]: [
        {
          start: `${dayMinus1} 09:30:00`,
          end: `${dayMinus1} 10:45:00`,
          title: "Sprint Planning",
          summary: "Room 402 - Mobile Architecture",
          color: isDark ? "#3B82F6" : "#2563EB",
        },
      ],
      [todayStr]: [
        // Morning overlapping duo
        {
          start: `${todayStr} 08:30:00`,
          end: `${todayStr} 09:45:00`,
          title: "Core Standup A",
          summary: "Mobile Team",
          color: isDark ? "#4F46E5" : "#6366F1",
        },
        {
          start: `${todayStr} 08:50:00`,
          end: `${todayStr} 09:40:00`,
          title: "DevOps Sync B",
          summary: "CI/CD Pipeline",
          color: isDark ? "#DB2777" : "#EC4899",
        },

        // Midday overlapping triad (like in doc example)
        {
          start: `${todayStr} 10:30:00`,
          end: `${todayStr} 12:00:00`,
          title: "Design Review A",
          summary: "Figma Tokens",
          color: isDark ? "#D97706" : "#F59E0B",
        },
        {
          start: `${todayStr} 11:00:00`,
          end: `${todayStr} 12:15:00`,
          title: "Client Pitch B",
          summary: "Executive Room",
          color: isDark ? "#7C3AED" : "#8B5CF6",
        },
        {
          start: `${todayStr} 11:20:00`,
          end: `${todayStr} 12:30:00`,
          title: "Security Audit C",
          summary: "SecOps Team",
          color: isDark ? "#0891B2" : "#06B6D4",
        },

        // Afternoon overlapping duo
        {
          start: `${todayStr} 13:30:00`,
          end: `${todayStr} 15:00:00`,
          title: "Release QA",
          summary: "Mobile Automated Tests",
          color: isDark ? "#059669" : "#10B981",
        },
        {
          start: `${todayStr} 14:00:00`,
          end: `${todayStr} 15:15:00`,
          title: "Sprint Backlog",
          summary: "Product Backlog Grooming",
          color: isDark ? "#2563EB" : "#3B82F6",
        },

        // Late Afternoon event
        {
          start: `${todayStr} 16:00:00`,
          end: `${todayStr} 17:30:00`,
          title: "Company All-Hands",
          summary: "Monthly Townhall Virtual",
          color: isDark ? "#4F46E5" : "#6366F1",
        },
      ],
      [dayPlus1]: [
        {
          start: `${dayPlus1} 10:00:00`,
          end: `${dayPlus1} 11:30:00`,
          title: "Client Presentation",
          summary: "Auditorium Main Stage",
          color: isDark ? "#2563EB" : "#3B82F6",
        },
        {
          start: `${dayPlus1} 15:00:00`,
          end: `${dayPlus1} 16:30:00`,
          title: "Tech Debt Cleanup",
          summary: "Refactoring modules",
          color: isDark ? "#D97706" : "#F59E0B",
        },
      ],
      [dayPlus2]: [
        {
          start: `${dayPlus2} 11:00:00`,
          end: `${dayPlus2} 12:30:00`,
          title: "Weekly Engineering All-Hands",
          summary: "Company Wide Virtual",
          color: isDark ? "#4F46E5" : "#6366F1",
        },
      ],
    };
  }, [dayMinus1, dayPlus1, dayPlus2, isDark, todayStr]);

  const [eventsByDate] = useState<
    Record<string, TimelineEventProps[]>
  >(initialEvents);

  const markedDates = useMemo(() => {
    return {
      [dayMinus1]: { marked: true, dotColor: colors.primary },
      [todayStr]: {
        selected: true,
        marked: true,
        dots: [
          { color: colors.primary },
          { color: colors.warning },
          { color: colors.success },
        ],
      },
      [dayPlus1]: { marked: true, dotColor: colors.accent },
      [dayPlus2]: { marked: true, dotColor: colors.primary },
    };
  }, [colors.accent, colors.primary, colors.warning, dayMinus1, dayPlus1, dayPlus2, todayStr]);

  const lastPressTime = React.useRef(0);

  const formatEventTime = (start?: string, end?: string) => {
    if (!start) return "";
    const startTime = start.split(" ")[1]?.substring(0, 5) || start;
    const endTime = end?.split(" ")[1]?.substring(0, 5) || end || "";
    return endTime ? `${startTime} - ${endTime}` : startTime;
  };

  const handleEventPress = useCallback(
    (event: TimelineEventProps) => {
      const now = Date.now();
      if (now - lastPressTime.current < 400) return;
      lastPressTime.current = now;

      const timeRange = formatEventTime(event.start, event.end);

      toast.show({
        title: event.title || "Event Details",
        description: `${timeRange ? `${timeRange} • ` : ""}${event.summary || "No description"}`,
        tone: "info",
        duration: 2500,
      });
    },
    [toast],
  );

  const timelineProps: Partial<TimelineCalendarProps> = useMemo(
    () => ({
      format24h: true,
      onEventPress: handleEventPress,
      unavailableHours: [
        { start: 0, end: 7 },
        { start: 19, end: 24 },
      ],
      overlapEventsSpacing: 8,
      rightEdgeSpacing: 16,
    }),
    [handleEventPress],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <SystemUIOverlay />

      <ScreenHeader
        title="Timeline Calendar"
        subtitle="24h Hourly Day Timeline & Events"
        showBack
        sticky={false}
        onBack={() => router.back()}
      />

      <View style={{ flex: 1 }}>
        <CalendarProvider
          date={currentDate}
          onDateChanged={(date: string) => setCurrentDate(date)}
          showTodayButton
        >
          <ExpandableCalendar
            initialPosition="closed"
            markedDates={markedDates}
            closeOnDayPress={false}
          />

          <TimelineList
            events={eventsByDate}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            initialTime={{ hour: 8, minutes: 0 }}
          />
        </CalendarProvider>
      </View>
    </View>
  );
}
