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
      <Card outlined>
        <Empty style={styles.emptySample}>
          <EmptyHeader>
            <EmptyMedia variant="icon" size="md">
              <FileText color={colors.primary} size={28} />
            </EmptyMedia>
            <EmptyTitle>No Documents Found</EmptyTitle>
            <EmptyDescription>
              There are no documents or files available in this collection yet.
              Create a new document to get started.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Box row center gap="sm" style={styles.wrap}>
              <Button size="sm">Create Document</Button>
              <Button size="sm" variant="outline" tone="secondary">
                Import File
              </Button>
            </Box>

            <Button
              size="sm"
              variant="ghost"
              tone="secondary"
              rightIcon={icon(ChevronRight)}
            >
              Browse Templates
            </Button>
          </EmptyContent>
        </Empty>
      </Card>
    </Section>
  );
}
