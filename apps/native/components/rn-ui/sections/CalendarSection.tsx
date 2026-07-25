import { Box, Calendar, Card, Text } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function CalendarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    selectedDate,
    setSelectedDate,
    rangeStart,
    rangeEnd,
    handleRangePress,
    getRangeMarkedDates,
  } = ctx;

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
              onDayPress={handleRangePress}
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
