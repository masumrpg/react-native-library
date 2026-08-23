import {
  Box,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  Text,
  useTheme,
} from "@masumdev/rn-ui";
import React from "react";
import { Animated, type LayoutChangeEvent } from "react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function ButtonGroupsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, radii } = useTheme();
  const [activeSegment, setActiveSegment] = React.useState<"weekly" | "monthly" | "yearly">("weekly");
  const [containerWidth, setContainerWidth] = React.useState(0);
  const padding = 4;
  const activeBlockWidth = containerWidth > 0 ? (containerWidth - padding * 2) / 3 : 0;
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let index = 0;
    if (activeSegment === "monthly") index = 1;
    if (activeSegment === "yearly") index = 2;

    Animated.spring(translateX, {
      toValue: index * activeBlockWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [activeSegment, activeBlockWidth, translateX]);

  return (
    <Section title="Button Groups">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            Layout containers to group multiple buttons, inputs, or static text
            boxes with unified border-radii.
          </Text>

          {/* Horizontal Button Group */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Horizontal Orientation
            </Text>
            <ButtonGroup orientation="horizontal">
              <ButtonGroupText>USD</ButtonGroupText>
              <Button variant="outline" tone="secondary" style={{ flex: 1 }}>
                Deposit
              </Button>
              <ButtonGroupSeparator />
              <Button variant="outline" tone="secondary" style={{ flex: 1 }}>
                Withdraw
              </Button>
            </ButtonGroup>
          </Box>

          {/* Segmented Actions with sliding background animation */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Segmented Actions (Animated)
            </Text>
            <ButtonGroup
              orientation="horizontal"
              style={{
                backgroundColor: colors.backgroundMuted,
                borderRadius: radii.lg,
                borderWidth: 1,
                borderColor: colors.border,
                position: "relative",
                overflow: "hidden",
                padding: padding,
              }}
              onLayout={(e: LayoutChangeEvent) =>
                setContainerWidth(e.nativeEvent.layout.width)
              }
            >
              {containerWidth > 0 && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      top: padding,
                      bottom: padding,
                      left: padding,
                      width: activeBlockWidth,
                      backgroundColor: colors.primary,
                      borderRadius: radii.md,
                    },
                    {
                      transform: [{ translateX }],
                    },
                  ]}
                />
              )}
              <Button
                variant="ghost"
                style={{ flex: 1 }}
                textStyle={{
                  color:
                    activeSegment === "weekly"
                      ? colors.onPrimary
                      : colors.textMuted,
                }}
                onPress={() => setActiveSegment("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant="ghost"
                style={{ flex: 1 }}
                textStyle={{
                  color:
                    activeSegment === "monthly"
                      ? colors.onPrimary
                      : colors.textMuted,
                }}
                onPress={() => setActiveSegment("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant="ghost"
                style={{ flex: 1 }}
                textStyle={{
                  color:
                    activeSegment === "yearly"
                      ? colors.onPrimary
                      : colors.textMuted,
                }}
                onPress={() => setActiveSegment("yearly")}
              >
                Yearly
              </Button>
            </ButtonGroup>
          </Box>

          {/* Vertical Button Group */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Vertical Orientation
            </Text>
            <ButtonGroup orientation="vertical">
              <Button variant="outline" tone="secondary" fullWidth>
                Option One
              </Button>
              <Button variant="outline" tone="secondary" fullWidth>
                Option Two
              </Button>
              <Button variant="outline" tone="secondary" fullWidth>
                Option Three
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
