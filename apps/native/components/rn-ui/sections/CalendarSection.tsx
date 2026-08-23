import { Badge, Box, Calendar, Card, Text } from "@masumdev/rn-ui";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CalendarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors } = ctx;

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = React.useState(todayStr);
  const [rangeStart, setRangeStart] = React.useState<string | null>("2026-07-10");
  const [rangeEnd, setRangeEnd] = React.useState<string | null>("2026-07-18");

  // Sample event markings with colored dots
  const markedEvents: Record<string, any> = {
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
        [start]: { selected: true, startingDay: true, endingDay: true, color: colors.primary },
      };
    }

    const marked: Record<string, any> = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const curr = new Date(startDate);

    while (curr <= endDate) {
      const dateStr = curr.toISOString().split("T")[0];
      if (dateStr === start) {
        marked[dateStr] = { startingDay: true, color: colors.primary, textColor: colors.onPrimary };
      } else if (dateStr === end) {
        marked[dateStr] = { endingDay: true, color: colors.primary, textColor: colors.onPrimary };
      } else {
        marked[dateStr] = { isMiddle: true, color: colors.backgroundMuted, textColor: colors.primary };
      }
      curr.setDate(curr.getDate() + 1);
    }

    return marked;
  };

  return (
    <Section title="Calendar">
      <Box gap="xl">
        {/* Single Selection & Event Indicators */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Box row center gap="xs">
                <CalendarIcon color={colors.primary} size={18} />
                <Text weight="700" color="text">
                  Events & Single Selection
                </Text>
              </Box>
              <Badge tone="primary">Fast Selector</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Tap month or year headers to open fast picker overlays, or use the Today pill to jump to current date.
            </Text>

            <Calendar
              current={selectedDate}
              markedDates={markedEvents}
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
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
              onDayPress={(day: any) => handleRangePress(day)}
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
      </Box>
    </Section>
  );
}
