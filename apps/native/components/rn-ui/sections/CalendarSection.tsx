import {
  Badge,
  Box,
  Button,
  Calendar,
  CalendarProvider,
  Card,
  ExpandableCalendar,
  Text,
  type CalendarDayData,
  type CalendarDayMarking,
  type ExpandableCalendarRef,
} from "@masumdev/rn-ui";
import { useRouter, type Href } from "expo-router";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CalendarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const router = useRouter();
  const { colors } = ctx;

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = React.useState(todayStr);
  const [rangeStart, setRangeStart] = React.useState<string | null>("2026-07-10");
  const [rangeEnd, setRangeEnd] = React.useState<string | null>("2026-07-18");

  // Multi-event date state
  const [eventDate, setEventDate] = React.useState<string>("2026-08-14");
  const [expandableDate, setExpandableDate] = React.useState<string>("2026-08-25");

  // Multi-event sample database
  const eventDatabase: Record<
    string,
    Array<{
      title: string;
      time: string;
      location: string;
      type: "engineering" | "design" | "marketing" | "review";
      dotColor: string;
    }>
  > = {
    "2026-08-04": [
      {
        title: "Sprint Retrospective",
        time: "09:30 AM",
        location: "Main Hall A",
        type: "engineering",
        dotColor: colors.primary,
      },
    ],
    "2026-08-08": [
      {
        title: "Mobile Design System Sync",
        time: "11:00 AM",
        location: "Figma Room 3",
        type: "design",
        dotColor: colors.success,
      },
      {
        title: "Iconography Review",
        time: "02:00 PM",
        location: "Virtual Meeting",
        type: "design",
        dotColor: colors.success,
      },
    ],
    "2026-08-14": [
      {
        title: "v0.3.0 Release Candidate",
        time: "10:00 AM",
        location: "CI/CD Pipeline",
        type: "engineering",
        dotColor: colors.primary,
      },
      {
        title: "Changelog Copywriting",
        time: "01:30 PM",
        location: "Marketing Room",
        type: "marketing",
        dotColor: colors.warning,
      },
      {
        title: "Stakeholder Demo",
        time: "04:00 PM",
        location: "Auditorium",
        type: "review",
        dotColor: colors.accent,
      },
    ],
    "2026-08-19": [
      {
        title: "Security & Vulnerability Audit",
        time: "10:00 AM",
        location: "SecOps Lab",
        type: "engineering",
        dotColor: colors.primary,
      },
    ],
    "2026-08-25": [
      {
        title: "Product Roadmap Kickoff",
        time: "09:00 AM",
        location: "Boardroom 1",
        type: "review",
        dotColor: colors.accent,
      },
      {
        title: "RN UI Workshop",
        time: "03:00 PM",
        location: "Training Room B",
        type: "engineering",
        dotColor: colors.primary,
      },
    ],
  };

  // Build multi-dot markings from event database
  const multiDotMarkings: Record<string, CalendarDayMarking> = {
    [eventDate]: { selected: true },
    "2026-08-04": {
      dots: [{ key: "sprint", color: colors.primary }],
    },
    "2026-08-08": {
      dots: [
        { key: "design-sync", color: colors.success },
        { key: "icons", color: colors.success },
      ],
    },
    "2026-08-14": {
      selected: eventDate === "2026-08-14",
      dots: [
        { key: "release", color: colors.primary },
        { key: "marketing", color: colors.warning },
        { key: "stakeholder", color: colors.accent },
      ],
    },
    "2026-08-19": {
      dots: [{ key: "security", color: colors.primary }],
    },
    "2026-08-25": {
      dots: [
        { key: "roadmap", color: colors.accent },
        { key: "workshop", color: colors.primary },
      ],
    },
  };

  // Single Selection sample event markings
  const markedEvents: Record<string, CalendarDayMarking> = {
    [selectedDate]: { selected: true },
    "2026-07-05": { marked: true, dotColor: colors.primary },
    "2026-07-12": {
      dots: [
        { key: "meeting", color: colors.primary },
        { key: "task", color: colors.warning },
      ],
    },
    "2026-07-15": { marked: true, dotColor: colors.success },
    "2026-07-22": {
      dots: [
        { key: "flight", color: colors.accent },
        { key: "hotel", color: colors.success },
      ],
    },
  };

  const handleRangePress = (day: { dateString: string }) => {
    const date = day.dateString;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (date < rangeStart) {
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const getRangeMarkedDates = (start: string | null, end: string | null) => {
    if (!start) return {};
    if (!end) {
      return {
        [start]: {
          selected: true,
          startingDay: true,
          endingDay: true,
          color: colors.primary,
        },
      };
    }

    const marked: Record<string, CalendarDayMarking> = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const curr = new Date(startDate);

    while (curr <= endDate) {
      const dateStr = curr.toISOString().split("T")[0];
      if (dateStr === start) {
        marked[dateStr] = {
          startingDay: true,
          color: colors.primary,
          textColor: colors.onPrimary,
        };
      } else if (dateStr === end) {
        marked[dateStr] = {
          endingDay: true,
          color: colors.primary,
          textColor: colors.onPrimary,
        };
      } else {
        marked[dateStr] = {
          isMiddle: true,
          color: colors.primarySoft,
          textColor: colors.primary,
        };
      }
      curr.setDate(curr.getDate() + 1);
    }

    return marked;
  };

  const activeEvents = eventDatabase[eventDate] || [];

  const expandableCalendarRef = React.useRef<ExpandableCalendarRef>(null);

  return (
    <Section title="Calendar">
      <Box gap="xl">
        {/* Multi-Dot Event Calendar & Agenda */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Box row center gap="xs">
                <Sparkles color={colors.accent} size={18} />
                <Text weight="700" color="text">
                  Multi-Dot Events & Schedule
                </Text>
              </Box>
              <Badge tone="accent">Multi-Dot</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Displays colored event indicators on dates with scheduled events. Tap any date to view agenda details.
            </Text>

            {/* Event Type Legends */}
            <Box row style={{ flexWrap: "wrap", gap: 8 }}>
              <Badge tone="primary" size="sm">
                Engineering
              </Badge>
              <Badge tone="success" size="sm">
                Design & UX
              </Badge>
              <Badge tone="warning" size="sm">
                Marketing
              </Badge>
              <Badge tone="accent" size="sm">
                Review & Demo
              </Badge>
            </Box>

            <Calendar
              current={eventDate}
              markedDates={multiDotMarkings}
              onDayPress={(day: CalendarDayData) => setEventDate(day.dateString)}
              showTodayButton
            />

            {/* Selected Date Agenda Card */}
            <Box
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 10,
              }}
            >
              <Box row center style={{ justifyContent: "space-between" }}>
                <Box row center gap="xs">
                  <CalendarIcon color={colors.primary} size={15} />
                  <Text weight="600" color="text" variant="bodySmall">
                    Agenda for {eventDate}
                  </Text>
                </Box>
                <Badge
                  tone={activeEvents.length > 0 ? "primary" : "secondary"}
                  variant="outline"
                  size="sm"
                >
                  {`${activeEvents.length} ${activeEvents.length === 1 ? "Event" : "Events"}`}
                </Badge>
              </Box>

              {activeEvents.length > 0 ? (
                <Box gap="sm">
                  {activeEvents.map((evt, idx) => (
                    <Box
                      key={idx}
                      row
                      center
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        backgroundColor: colors.surface,
                        borderLeftWidth: 3.5,
                        borderLeftColor: evt.dotColor,
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <Box gap="xs" style={{ flex: 1 }}>
                        <Text weight="600" color="text" style={{ fontSize: 13 }}>
                          {evt.title}
                        </Text>
                        <Box row center style={{ gap: 14 }}>
                          <Box row center gap="xs">
                            <Clock color={colors.textMuted} size={13} />
                            <Text color="textMuted" variant="caption">
                              {evt.time}
                            </Text>
                          </Box>
                          <Box row center gap="xs">
                            <MapPin color={colors.textMuted} size={13} />
                            <Text color="textMuted" variant="caption">
                              {evt.location}
                            </Text>
                          </Box>
                        </Box>
                      </Box>

                      <Badge
                        tone={
                          evt.type === "engineering"
                            ? "primary"
                            : evt.type === "design"
                              ? "success"
                              : evt.type === "marketing"
                                ? "warning"
                                : "accent"
                        }
                        size="sm"
                        style={{ alignSelf: "center" }}
                      >
                        {evt.type}
                      </Badge>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box row center gap="xs" style={{ paddingVertical: 4 }}>
                  <CheckCircle2 color={colors.textMuted} size={14} />
                  <Text color="textMuted" variant="caption">
                    No scheduled events on this date. Tap Aug 4, 8, 14, 19, or 25 to test events!
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        </Card>

        {/* Single Selection & Fast Month/Year Picker */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Box row center gap="xs">
                <Layers color={colors.primary} size={18} />
                <Text weight="700" color="text">
                  Fast Month & Year Selector
                </Text>
              </Box>
              <Badge tone="primary">Fast Selector</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Tap month or year headers to open fast picker overlays with smooth ease-out transitions.
            </Text>

            <Calendar
              current={selectedDate}
              markedDates={markedEvents}
              onDayPress={(day: CalendarDayData) => setSelectedDate(day.dateString)}
              showTodayButton
            />

            {/* Event Legend & Selected Card */}
            <Box
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 8,
              }}
            >
              <Box row center style={{ justifyContent: "space-between" }}>
                <Text weight="600" color="text" variant="bodySmall">
                  Selected: {selectedDate}
                </Text>
                <Badge tone="success" variant="outline">
                  ACTIVE
                </Badge>
              </Box>

              <Box row center gap="md">
                <Box row center gap="xs">
                  <Clock color={colors.primary} size={14} />
                  <Text color="textMuted" variant="caption">
                    10:00 AM - Sprint Planning
                  </Text>
                </Box>
                <Box row center gap="xs">
                  <MapPin color={colors.warning} size={14} />
                  <Text color="textMuted" variant="caption">
                    Room 4B
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Range Selection Calendar */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Period & Date Range Selection
              </Text>
              <Badge tone="accent" variant="outline">
                Period Range
              </Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Tap start date and end date to select booking range.
            </Text>

            <Calendar
              current="2026-07-12"
              markedDates={getRangeMarkedDates(rangeStart, rangeEnd)}
              onDayPress={(day: CalendarDayData) => handleRangePress(day)}
            />

            <Box
              row
              center
              style={{
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text color="textMuted" variant="bodySmall">
                Check-in / Check-out
              </Text>
              <Text weight="700" color="primary" variant="bodySmall">
                {rangeStart || "None"} ➔ {rangeEnd || "None"}
              </Text>
            </Box>
          </Box>
        </Card>

        {/* Expandable Calendar Showcase */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Box row center gap="xs">
                <ChevronDown color={colors.primary} size={18} />
                <Text weight="700" color="text">
                  Expandable Week / Month Calendar
                </Text>
              </Box>
              <Badge tone="primary">Expandable</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Swipe down the bottom knob to expand to full month view, or swipe up to collapse into a single week row.
            </Text>

            <Box
              style={{
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <CalendarProvider
                date={expandableDate}
                onDateChanged={(date: string) => setExpandableDate(date)}
              >
                <ExpandableCalendar
                  ref={expandableCalendarRef}
                  initialPosition="closed"
                  markedDates={{
                    [expandableDate]: { selected: true },
                    "2026-08-04": { dots: [{ color: colors.primary }] },
                    "2026-08-08": { dots: [{ color: colors.success }] },
                    "2026-08-14": {
                      dots: [
                        { color: colors.primary },
                        { color: colors.warning },
                        { color: colors.accent },
                      ],
                    },
                    "2026-08-19": { dots: [{ color: colors.primary }] },
                    "2026-08-25": { dots: [{ color: colors.accent }] },
                  }}
                  closeOnDayPress={false}
                />
              </CalendarProvider>
            </Box>

            <Box
              row
              center
              style={{
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.surfaceMuted,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Box gap="xxs">
                <Text color="textMuted" variant="caption">
                  Focused Date
                </Text>
                <Text weight="700" color="primary" variant="bodySmall">
                  {expandableDate}
                </Text>
              </Box>

              <Button
                size="sm"
                variant="outline"
                onPress={() => expandableCalendarRef.current?.toggleCalendarPosition()}
              >
                Toggle Week / Month
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Dedicated Timeline Calendar Screen Launcher */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Box row center gap="xs">
                <Clock color={colors.accent} size={18} />
                <Text weight="700" color="text">
                  Dedicated Timeline Calendar
                </Text>
              </Box>
              <Badge tone="accent">Heavy / Fullscreen</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Full 24-hour daily timeline grid with live now indicator, expandable calendar header, and interactive event blocks.
            </Text>

            <Button
              variant="filled"
              tone="primary"
              onPress={() => router.push("/rn-ui/timeline-calendar" as Href)}
            >
              Open Fullscreen Timeline
            </Button>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
