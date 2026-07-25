import { Box, Card, IconButton } from "@masumdev/rn-ui";
import { ArrowLeft, Heart, Plus, Settings } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function IconButtonsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon } = ctx;

  return (
    <Section title="Icon Buttons">
      <Card>
        <Box row gap="md" center style={styles.wrap}>
          <IconButton icon={icon(ArrowLeft)} variant="ghost" />
          <IconButton icon={icon(Settings)} variant="outline" />
          <IconButton icon={icon(Heart)} variant="soft" />
          <IconButton icon={icon(Plus)} variant="filled" />
          <IconButton icon={icon(Heart)} variant="soft" badge={12} />
        </Box>
      </Card>
    </Section>
  );
}
