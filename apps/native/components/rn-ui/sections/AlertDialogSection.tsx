import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import { Trash } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function AlertDialogSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, setAlertDialogVisible } = ctx;

  return (
    <Section title="Alert Dialog">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Modal confirmation dialog with flat border styling, animated entry,
            backdrop dismiss, and pluggable icons.
          </Text>
          <Button
            variant="danger"
            leftIcon={icon(Trash)}
            onPress={() => setAlertDialogVisible(true)}
          >
            Open Delete Dialog
          </Button>
        </Box>
      </Card>
    </Section>
  );
}
