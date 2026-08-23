import { Box, Calendar, Card, Text } from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function CalendarSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  const [selectedDate, setSelectedDate] = React.useState("2026-07-12");
  const [rangeStart, setRangeStart] = React.useState<string | null>("2026-07-10");
  const [rangeEnd, setRangeEnd] = React.useState<string | null>("2026-07-18");

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
        [start]: { selected: true, startingDay: true, endingDay: true, color: "#06B6D4" },
      };
    }

    const marked: Record<string, any> = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    const curr = new Date(startDate);

    while (curr <= endDate) {
      const dateStr = curr.toISOString().split("T")[0];
      if (dateStr === start) {
        marked[dateStr] = { startingDay: true, color: "#06B6D4", textColor: "#FFFFFF" };
      } else if (dateStr === end) {
        marked[dateStr] = { endingDay: true, color: "#06B6D4", textColor: "#FFFFFF" };
      } else {
        marked[dateStr] = { isMiddle: true, color: "rgba(6, 182, 212, 0.2)", textColor: "#06202A" };
      }
      curr.setDate(curr.getDate() + 1);
    }

    return marked;
  };

  return (
    <Section title="Calendar">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Date selector calendar utilizing wix react-native-calendars styled
            with our themed custom day cells.
          </Text>

          {/* Single selection calendar */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Single Selection & Today
            </Text>
            <Calendar
              current="2026-07-12"
              markedDates={{
                [selectedDate]: { selected: true },
              }}
              onDayPress={(day: any) => setSelectedDate(day.dateString)}
            />
            <Text
              variant="bodySmall"
              color="textMuted"
              style={{ marginTop: 4 }}
            >
              Selected Date:{" "}
              <Text
                variant="bodySmall"
                color="primary"
                style={{ fontWeight: "600" }}
              >
                {selectedDate}
              </Text>
            </Text>
          </Box>

          {/* Range selection calendar */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Range Selection (Period Marking)
            </Text>
            <Calendar
              current="2026-07-12"
              markedDates={getRangeMarkedDates(rangeStart, rangeEnd)}
              onDayPress={(day: any) => handleRangePress(day)}
            />
            <Text
              variant="bodySmall"
              color="textMuted"
              style={{ marginTop: 4 }}
            >
              Selected Range:{" "}
              <Text
                variant="bodySmall"
                color="primary"
                style={{ fontWeight: "600" }}
              >
                {rangeStart || "None"}
              </Text>{" "}
              to{" "}
              <Text
                variant="bodySmall"
                color="primary"
                style={{ fontWeight: "600" }}
              >
                {rangeEnd || "None"}
              </Text>
            </Text>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
