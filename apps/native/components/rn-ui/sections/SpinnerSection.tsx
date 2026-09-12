import {
  Badge,
  Box,
  Button,
  Card,
  Spinner,
  type SpinnerSize,
  type SpinnerSpeed,
  type SpinnerVariant,
  Text,
} from "@masumdev/rn-ui";
import { RotateCcw } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function SpinnerSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, icon } = ctx;

  const [variant, setVariant] = React.useState<SpinnerVariant>("circular");
  const [size, setSize] = React.useState<SpinnerSize>("default");
  const [speed, setSpeed] = React.useState<SpinnerSpeed>("normal");
  const [animated, setAnimated] = React.useState(true);

  // Card overlay simulation
  const [isOverlayLoading, setIsOverlayLoading] = React.useState(false);

  const triggerOverlaySync = () => {
    setIsOverlayLoading(true);
    setTimeout(() => {
      setIsOverlayLoading(false);
    }, 2500);
  };

  return (
    <Section title="Spinner & Loaders">
      <Box gap="xl">
        {/* Interactive Playground Card */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Live Spinner Playground
              </Text>
              <Button
                size="xs"
                variant="outline"
                onPress={() => setAnimated(!animated)}
              >
                {animated ? "Pause" : "Play"}
              </Button>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              High-performance 60-120fps UI thread loaders with zero memory leaks and safe unmount cleanup.
            </Text>

            {/* Live Preview Box */}
            <Box
              center
              style={{
                paddingVertical: 36,
                backgroundColor: colors.backgroundSubtle,
                borderRadius: 12,
              }}
            >
              <Spinner
                variant={variant}
                size={size}
                speed={speed}
                tone="primary"
                animated={animated}
                label={`Loading with ${variant} style...`}
                labelPlacement="bottom"
              />
            </Box>

            {/* Variant Selector */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Variant
              </Text>
              <Box row gap="xs" style={{ flexWrap: "wrap" }}>
                {(["circular", "ring", "dots", "bars"] as const).map((v) => (
                  <Button
                    key={v}
                    size="xs"
                    variant={variant === v ? "filled" : "outline"}
                    tone="primary"
                    onPress={() => setVariant(v)}
                  >
                    {v}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Size Selector */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Size
              </Text>
              <Box row gap="xs" style={{ flexWrap: "wrap" }}>
                {(["xs", "sm", "default", "lg", "xl"] as const).map((s) => (
                  <Button
                    key={s}
                    size="xs"
                    variant={size === s ? "filled" : "outline"}
                    tone="secondary"
                    onPress={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Speed Selector */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Speed
              </Text>
              <Box row gap="xs" style={{ flexWrap: "wrap" }}>
                {(["slow", "normal", "fast"] as const).map((spd) => (
                  <Button
                    key={spd}
                    size="xs"
                    variant={speed === spd ? "filled" : "outline"}
                    tone="accent"
                    onPress={() => setSpeed(spd)}
                  >
                    {spd}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </Card>

        {/* All Variants Gallery */}
        <Card outlined>
          <Box gap="md">
            <Text weight="700" color="text">
              Loader Variants
            </Text>
            <Text color="textMuted" variant="bodySmall">
              Four distinct animation styles for different UX context and hierarchies.
            </Text>

            <Box row gap="md" style={{ justifyContent: "space-around", flexWrap: "wrap", paddingVertical: 12 }}>
              <Box center gap="xs">
                <Spinner variant="circular" size="lg" tone="primary" />
                <Text variant="caption" color="textMuted">
                  Circular Arc
                </Text>
              </Box>

              <Box center gap="xs">
                <Spinner variant="ring" size="lg" tone="accent" />
                <Text variant="caption" color="textMuted">
                  Dual Ring
                </Text>
              </Box>

              <Box center gap="xs">
                <Spinner variant="dots" size="lg" tone="success" />
                <Text variant="caption" color="textMuted">
                  Wave Dots
                </Text>
              </Box>

              <Box center gap="xs">
                <Spinner variant="bars" size="lg" tone="warning" />
                <Text variant="caption" color="textMuted">
                  Sound Bars
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Semantic Tones */}
        <Card outlined>
          <Box gap="md">
            <Text weight="700" color="text">
              Semantic Color Tones
            </Text>
            <Text color="textMuted" variant="bodySmall">
              Inherits full design tokens from the active theme.
            </Text>

            <Box row gap="sm" style={{ flexWrap: "wrap", justifyContent: "space-between", paddingVertical: 8 }}>
              {(["primary", "secondary", "accent", "success", "warning", "danger", "info"] as const).map((t) => (
                <Box key={t} center gap="xs" style={{ minWidth: 60 }}>
                  <Spinner tone={t} size="sm" />
                  <Badge tone={t} variant="subtle" size="sm">
                    {t}
                  </Badge>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {/* Card Overlay Loading Simulation */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Card Overlay Simulation
              </Text>
              <Button
                size="xs"
                variant="filled"
                tone="primary"
                leftIcon={icon(RotateCcw)}
                onPress={triggerOverlaySync}
                disabled={isOverlayLoading}
              >
                {isOverlayLoading ? "Syncing..." : "Sync Cloud"}
              </Button>
            </Box>

            <Box
              style={{
                position: "relative",
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.backgroundSubtle,
                overflow: "hidden",
              }}
            >
              <Box gap="xs">
                <Text variant="label" weight="600">
                  Ma'sum Cloud Storage
                </Text>
                <Text variant="bodySmall" color="textMuted">
                  48 mobile packages, 227 verified clean files, 1.4k followers connected.
                </Text>
                <Box row gap="xs" style={{ marginTop: 8 }}>
                  <Badge tone="success" variant="soft" size="sm">
                    Connected
                  </Badge>
                  <Badge tone="primary" variant="soft" size="sm">
                    v0.3.0
                  </Badge>
                </Box>
              </Box>

              {/* Loading Overlay */}
              {isOverlayLoading && (
                <Box
                  center
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: colors.surface ? `${colors.surface}E6` : "rgba(255,255,255,0.9)",
                    zIndex: 10,
                  }}
                >
                  <Spinner
                    variant="ring"
                    size="default"
                    tone="primary"
                    label="Syncing cloud assets..."
                    labelPlacement="bottom"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
