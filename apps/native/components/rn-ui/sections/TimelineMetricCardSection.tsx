import {
  Box,
  Card,
  MetricCard,
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTitle,
} from "@masumdev/rn-ui";
import { BarChart3 } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function TimelineMetricCardSection({
  ctx,
}: {
  ctx: RnUiSectionContext;
}) {
  const { icon } = ctx;

  return (
    <Section title="Timeline, Metric Card">
      <Card>
        <Box gap="md">
          <MetricCard
            label="Expo React Native"
            value="2026"
            delta="+12 reusable components"
            icon={icon(BarChart3)}
          />

          <Timeline>
            <TimelineItem active>
              <TimelineTitle>Theme tokens</TimelineTitle>
              <TimelineDescription>
                Flat border system by Ma'sum.
              </TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineTitle>Component samples</TimelineTitle>
              <TimelineDescription>
                Ready for Expo React Native apps.
              </TimelineDescription>
            </TimelineItem>
          </Timeline>
        </Box>
      </Card>
    </Section>
  );
}
