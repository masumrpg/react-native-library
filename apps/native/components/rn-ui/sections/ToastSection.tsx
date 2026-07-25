import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import { Check, CircleAlert, X } from "lucide-react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function ToastSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon, toast } = ctx;

  return (
    <Section title="Toast">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Programmatic flat toast with themed border, action, close, and swipe
            dismiss.
          </Text>

          <Box row gap="sm" style={styles.wrap}>
            <Button
              size="sm"
              onPress={() =>
                toast.show({
                  title: "Expo React Native",
                  description: "Toast by Ma'sum for 2026 mobile UI.",
                  tone: "success",
                  icon: icon(Check),
                  action: {
                    label: "Undo",
                    onPress: () => undefined,
                  },
                })
              }
            >
              Show Toast
            </Button>

            <Button
              size="sm"
              variant="outline"
              tone="secondary"
              onPress={() =>
                toast.show({
                  title: "Something needs attention",
                  description:
                    "Danger toast follows the same flat token system.",
                  tone: "danger",
                  icon: icon(CircleAlert),
                  closeIcon: icon(X),
                })
              }
            >
              Danger
            </Button>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
