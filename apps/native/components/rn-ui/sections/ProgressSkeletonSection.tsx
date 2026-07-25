import { Box, Card, Progress, Skeleton } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function ProgressSkeletonSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { sliderValue } = ctx;

  return (
    <Section title="Progress, Skeleton">
      <Card>
        <Box gap="md">
          <Progress value={sliderValue} />
          <Box gap="sm">
            <Skeleton style={{ height: 18, width: "68%" }} />
            <Skeleton style={{ height: 14, width: "92%" }} />
            <Skeleton style={{ height: 14, width: "54%" }} />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
