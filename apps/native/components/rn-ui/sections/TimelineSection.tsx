import { Timeline, TimelineDescription, TimelineItem, TimelineTitle, Card, Box } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function TimelineSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Timeline">
      <Card outlined>
        <Box gap="md">
          <Timeline>
            <TimelineItem active>
              <TimelineTitle>v0.1.7 - Base UI Props & RULES.md</TimelineTitle>
              <TimelineDescription>
                Exported shared ToneProps, VariantProps, and published architecture rules.
              </TimelineDescription>
            </TimelineItem>
            <TimelineItem active>
              <TimelineTitle>v0.1.6 - Strict Type Safety</TimelineTitle>
              <TimelineDescription>
                Eliminated all `any` types across components and event handlers.
              </TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineTitle>v0.1.0 - Initial Release</TimelineTitle>
              <TimelineDescription>
                Added 55+ production-grade React Native UI primitives.
              </TimelineDescription>
            </TimelineItem>
          </Timeline>
        </Box>
      </Card>
    </Section>
  );
}
