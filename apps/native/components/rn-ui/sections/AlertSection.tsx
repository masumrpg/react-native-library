import { Alert, Box, Text } from "@masumdev/rn-ui";
import { Check, CircleAlert, TriangleAlert, OctagonAlert, X } from "lucide-react-native";
import React from "react";
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
        <Text color="textMuted">
          Notification banners with semantic tones, glassmorphism, accent bar variants, and actions.
        </Text>

        {/* 1. Soft Alert with Action & Details Toggle */}
        <Alert
          tone="info"
          variant="soft"
          title="Information Alert"
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
              Alert uses soft translucent tints, crisp typography, and interactive actions.
            </Text>
            <AnimatedDetail visible={showAlertDetails}>
              <Box
                bg="infoSoft"
                radius="lg"
                p="md"
                style={styles.alertDetailsBox}
              >
                <Text variant="bodySmall" color="textMuted">
                  Details can be toggled smoothly through component actions.
                </Text>
              </Box>
            </AnimatedDetail>
          </Box>
        </Alert>

        {/* 2. Success Accent Bar Variant */}
        <Alert
          tone="success"
          variant="accent"
          title="System Update Complete"
          icon={icon(Check)}
          closeIcon={icon(X)}
          dismissible
        >
          Your workspace configuration has been updated successfully to v2.4.0.
        </Alert>

        {/* 3. Warning Glassmorphism Alert */}
        <Alert
          tone="warning"
          variant="glass"
          title="Storage Limit Warning"
          icon={icon(TriangleAlert)}
        >
          You are using 88% of your allocated cloud storage. Consider upgrading.
        </Alert>

        {/* 4. Solid Rich Dark Mode Danger Alert */}
        <Alert
          tone="danger"
          variant="solid"
          title="Critical Error Occurred"
          icon={icon(OctagonAlert)}
          dismissible
        >
          Failed to establish database connection. Please check network credentials and retry.
        </Alert>
      </Box>
    </Section>
  );
}
