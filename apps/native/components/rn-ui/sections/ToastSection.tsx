import {
  AspectRatio,
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  Badge,
  Box,
  Button,
  Card,
  Text,
} from "@masumdev/rn-ui";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Loader,
  ArrowRight,
  Download,
  Image as ImageIcon,
  Layers,
} from "lucide-react-native";
import React from "react";
import { Image, View } from "react-native";
import { SAMPLE_ASSETS, Section, type RnUiSectionContext } from "../shared";

export function ToastSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { icon, toast } = ctx;
  const [loading, setLoading] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  // 1. Live Download Progress Toast
  const handleDownloadProgressToast = () => {
    if (downloading) return;
    setDownloading(true);

    let progress = 0;
    const toastId = toast.show({
      title: "Downloading Update...",
      description: "firmware_v2.4.bin (0%)",
      tone: "info",
      variant: "subtle",
      progress: 0,
      icon: icon(Loader),
      duration: 0,
    });

    const interval = setInterval(() => {
      progress += 20;
      if (progress < 100) {
        toast.update(toastId, {
          title: "Downloading Update...",
          description: `firmware_v2.4.bin (${progress}%)`,
          progress,
          icon: icon(Loader),
        });
      } else {
        clearInterval(interval);
        setDownloading(false);
        toast.update(toastId, {
          title: "Download Complete",
          description: "firmware_v2.4.bin is ready to install.",
          tone: "success",
          progress: undefined,
          icon: icon(CheckCircle2),
          duration: 3500,
          action: {
            label: "Install",
            onPress: () => {
              toast.show({
                title: "Installing...",
                description: "Applying firmware update.",
                tone: "info",
                icon: icon(Loader),
              });
            },
          },
        });
      }
    }, 450);
  };

  // 2. 16:9 Image Banner Toast
  const handleImageBannerToast = () => {
    toast.show({
      title: "Taman Langit Pangalengan",
      description: "Pemandangan alam menakjubkan dengan hamparan kebun teh dan awan.",
      tone: "default",
      variant: "subtle",
      banner: (
        <AspectRatio ratio={16 / 9} radius="lg">
          <Image
            source={{
              uri: SAMPLE_ASSETS.bannerImageUrl,
            }}
            resizeMode="cover"
          />
        </AspectRatio>
      ),
    });
  };

  // 3. Rich Media / Avatar Toast
  const handleMediaAvatarToast = () => {
    toast.show({
      title: SAMPLE_ASSETS.avatarName,
      description: "Uploaded 3 new high-res UI mockups.",
      tone: "default",
      variant: "subtle",
      media: (
        <Avatar size={50}>
          <AvatarImage
            source={{
              uri: SAMPLE_ASSETS.avatarUrl,
            }}
          />
          <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
      ),
      action: {
        label: "View",
        onPress: () => {
          toast.show({
            title: "Mockups Opened",
            description: `Displaying ${SAMPLE_ASSETS.avatarName}'s uploaded files.`,
            tone: "success",
          });
        },
      },
    });
  };

  // 4. Custom Rich Content (Badges & Chips) Toast
  const handleCustomContentToast = () => {
    toast.show({
      title: "Deployment Finished",
      description: "Pipeline #4811 completed successfully.",
      tone: "success",
      variant: "subtle",
      icon: icon(CheckCircle2),
      content: (
        <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
          <Badge tone="success" variant="soft" size="sm">
            Production
          </Badge>
          <Badge tone="primary" variant="outline" size="sm">
            v2.4.0
          </Badge>
        </View>
      ),
    });
  };

  // 4. Async Promise Toast (Loading -> Success)
  const handleAsyncPromiseToast = () => {
    setLoading(true);

    const toastId = toast.show({
      title: "Saving Settings...",
      description: "Syncing configuration with cloud database...",
      tone: "info",
      variant: "subtle",
      icon: icon(Loader),
      duration: 0,
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

  // 5. Interactive Action Toast (Undo)
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

  // 6. Interactive Retry Action Toast
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

  // 7. Standard Variant Triggers
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
            Programmatic flat toast alerts with iOS card stack deck, drag-down expansion, live progress bars, rich media avatars, and action callbacks.
          </Text>

          {/* Progress & Rich Content */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              Live Progress & Rich Media
            </Text>
            <Box row style={{ flexWrap: "wrap", gap: 8 }}>
              <Button
                variant="filled"
                tone="primary"
                leftIcon={icon(Download)}
                loading={downloading}
                onPress={handleDownloadProgressToast}
              >
                Live Download Progress
              </Button>

              <Button
                variant="outline"
                tone="accent"
                leftIcon={icon(ImageIcon)}
                onPress={handleImageBannerToast}
              >
                16:9 Image Banner
              </Button>

              <Button
                variant="outline"
                tone="primary"
                leftIcon={icon(ImageIcon)}
                onPress={handleMediaAvatarToast}
              >
                Media Avatar Toast
              </Button>

              <Button
                variant="outline"
                tone="secondary"
                leftIcon={icon(Layers)}
                onPress={handleCustomContentToast}
              >
                Custom Badge Content
              </Button>
            </Box>
          </Box>

          {/* Async & Interactive Actions */}
          <Box gap="xs">
            <Text variant="labelSmall" color="textMuted">
              Async & Interactive Actions
            </Text>
            <Box row style={{ flexWrap: "wrap", gap: 8 }}>
              <Button
                variant="outline"
                tone="info"
                leftIcon={icon(Loader)}
                loading={loading}
                onPress={handleAsyncPromiseToast}
              >
                Async State (Load → Done)
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
