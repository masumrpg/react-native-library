import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  Bell,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Loader,
  ArrowRight,
} from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function ToastSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, toast } = ctx;
  const [loading, setLoading] = React.useState(false);

  // 1. Async Promise Toast (Loading -> Success)
  const handleAsyncPromiseToast = () => {
    setLoading(true);

    const toastId = toast.show({
      title: "Saving Settings...",
      description: "Syncing configuration with cloud database...",
      tone: "info",
      variant: "subtle",
      icon: icon(Loader),
      duration: 0, // Keep open during async process
    });

    setTimeout(() => {
      setLoading(false);
      toast.update(toastId, {
        title: "Settings Saved!",
        description: "Cloud synchronization finished successfully.",
        tone: "success",
        variant: "outlined",
        icon: icon(CheckCircle2),
        duration: 3500,
        action: {
          label: "View",
          onPress: () => {
            toast.show({
              title: "Viewing Details",
              description: "Opened settings detail page.",
              tone: "default",
              variant: "flat",
              icon: icon(Info),
            });
          },
        },
      });
    }, 2000);
  };

  // 2. Interactive Action Toast (Undo)
  const handleActionUndoToast = () => {
    toast.show({
      title: "File Moved to Trash",
      description: "item_v2_backup.zip was relocated.",
      tone: "warning",
      variant: "outlined",
      icon: icon(AlertTriangle),
      action: {
        label: "Undo",
        onPress: () => {
          toast.show({
            title: "File Restored",
            description: "Restored item_v2_backup.zip to original folder.",
            tone: "success",
            variant: "flat",
            icon: icon(RotateCcw),
          });
        },
      },
    });
  };

  // 3. Interactive Retry Action Toast
  const handleActionRetryToast = () => {
    toast.show({
      title: "Network Error",
      description: "Request to api.masumdev.com timed out.",
      tone: "danger",
      variant: "outlined",
      icon: icon(AlertCircle),
      action: {
        label: "Retry",
        onPress: () => {
          handleAsyncPromiseToast();
        },
      },
    });
  };

  // 4. Standard Variant Triggers
  const showOutlinedToast = () => {
    toast.show({
      title: "Outlined Toast",
      description: "Prominent colored border with surface card background.",
      tone: "success",
      variant: "outlined",
      icon: icon(CheckCircle2),
    });
  };

  const showFlatToast = () => {
    toast.show({
      title: "Flat Toast (Borderless)",
      description: "Soft solid background fill with zero borders.",
      tone: "info",
      variant: "flat",
      icon: icon(Sparkles),
    });
  };

  const showSubtleToast = () => {
    toast.show({
      title: "Subtle Toast",
      description: "Subtle translucent border with soft tint background.",
      tone: "warning",
      variant: "subtle",
      icon: icon(ShieldAlert),
    });
  };

  return (
    <Section title="Toast Notification">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Programmatic flat toast alerts with safe-area bottom inset, async state updates, interactive action callbacks (Undo/Retry), and border variants.
          </Text>

          {/* Async & Interactive Actions */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              Async & Interactive Actions
            </Text>
            <Box row style={{ flexWrap: "wrap", gap: 8 }}>
              <Button
                variant="filled"
                tone="primary"
                leftIcon={icon(Loader)}
                loading={loading}
                onPress={handleAsyncPromiseToast}
              >
                Async Process (Loading → Success)
              </Button>

              <Button
                variant="outline"
                tone="accent"
                leftIcon={icon(RotateCcw)}
                onPress={handleActionUndoToast}
              >
                Action (Undo)
              </Button>

              <Button
                variant="outline"
                tone="danger"
                leftIcon={icon(ArrowRight)}
                onPress={handleActionRetryToast}
              >
                Action (Retry)
              </Button>
            </Box>
          </Box>

          {/* Border Variants */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              Border Variants & Styling
            </Text>
            <Box row style={{ flexWrap: "wrap", gap: 8 }}>
              <Button
                variant="outline"
                tone="primary"
                leftIcon={icon(CheckCircle2)}
                onPress={showOutlinedToast}
              >
                Outlined (Border)
              </Button>

              <Button
                variant="outline"
                tone="secondary"
                leftIcon={icon(Sparkles)}
                onPress={showFlatToast}
              >
                Flat (Borderless)
              </Button>

              <Button
                variant="outline"
                tone="warning"
                leftIcon={icon(ShieldAlert)}
                onPress={showSubtleToast}
              >
                Subtle (Soft)
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
