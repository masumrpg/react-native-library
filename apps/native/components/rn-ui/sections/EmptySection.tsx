import {
  Box,
  Button,
  Card,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@masumdev/rn-ui";
import { ChevronRight, FileText } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function EmptySection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles, icon } = ctx;

  return (
    <Section title="Empty">
      <Card>
        <Empty style={styles.emptySample}>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText color={colors.text} size={16} />
            </EmptyMedia>
            <EmptyTitle>Expo React Native</EmptyTitle>
            <EmptyDescription>
              Expo React Native by Ma'sum. Crafted for consistent mobile UI in
              2026.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Box row center gap="sm" style={styles.wrap}>
              <Button size="sm">Explore 2026</Button>
              <Button size="sm" variant="outline" tone="secondary">
                by Ma'sum
              </Button>
            </Box>

            <Button
              size="sm"
              variant="ghost"
              tone="secondary"
              rightIcon={icon(ChevronRight)}
            >
              Expo React Native
            </Button>
          </EmptyContent>
        </Empty>
      </Card>
    </Section>
  );
}
