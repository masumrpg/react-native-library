import { Alert, Box, Text } from "@masumdev/rn-ui";
import { Check, CircleAlert, X } from "lucide-react-native";
import {
  AnimatedDetail,
  AnimatedToggleIcon,
  Section,
  type RnUiSectionContext,
} from "../shared";

export function AlertSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles, icon, showAlertDetails, setShowAlertDetails } = ctx;

  return (
    <Section title="Alert">
      <Box gap="md">
        <Alert
          tone="info"
          title="Information"
          icon={icon(CircleAlert)}
          action={{
            label: showAlertDetails ? "Hide details" : "View details",
            icon: ({ color, size }) => (
              <AnimatedToggleIcon
                color={color}
                size={size}
                expanded={showAlertDetails}
                direction="down"
              />
            ),
            onPress: () => setShowAlertDetails((value: boolean) => !value),
          }}
        >
          <Box gap="sm">
            <Text color="textMuted">
              Alert uses semantic tones, flat borders, and pluggable icons.
            </Text>
            <AnimatedDetail visible={showAlertDetails}>
              <Box
                bg="infoSoft"
                radius="lg"
                p="md"
                style={styles.alertDetailsBox}
              >
                <Text variant="bodySmall" color="textMuted">
                  Details can be controlled from app state through the action
                  callback. The Alert component stays generic.
                </Text>
              </Box>
            </AnimatedDetail>
          </Box>
        </Alert>

        <Alert
          tone="success"
          variant="outline"
          title="Success"
          icon={icon(Check)}
          closeIcon={icon(X)}
          dismissible
          onClose={() => undefined}
        >
          Use actions and close controls only when the app needs them.
        </Alert>

        <Alert tone="danger" variant="solid" title="Danger">
          Solid alerts are available for stronger feedback states.
        </Alert>
      </Box>
    </Section>
  );
}
