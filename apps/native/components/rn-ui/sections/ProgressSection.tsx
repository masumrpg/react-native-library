import {
  Badge,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Progress,
  Text,
} from "@masumdev/rn-ui";
import { Play, RotateCcw } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function ProgressSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  const [liveProgress, setLiveProgress] = React.useState(65);
  const [isSimulating, setIsSimulating] = React.useState(false);

  React.useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setLiveProgress((prev) => {
        if (prev >= 100) {
          setIsSimulating(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [isSimulating]);

  const handleSimulate = () => {
    setLiveProgress(0);
    setIsSimulating(true);
  };

  return (
    <Section title="Progress Bar & Circular Progress">
      <Box gap="xl">
        {/* Interactive Progress Demo */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Live Interactive Progress
              </Text>
              <Text weight="700" color="primary">
                {liveProgress}%
              </Text>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Reanimated UI thread progress bar with smooth spring/cubic easing.
            </Text>

            <Progress value={liveProgress} tone="primary" size="default" />

            <Box row gap="sm" style={{ marginTop: 4 }}>
              <Button
                size="xs"
                variant="filled"
                tone="primary"
                leftIcon={({ color, size }) => <Play color={color} size={size} />}
                onPress={handleSimulate}
                disabled={isSimulating}
              >
                {isSimulating ? "Simulating..." : "Start Upload Demo"}
              </Button>
              <Button
                size="xs"
                variant="outline"
                leftIcon={({ color, size }) => <RotateCcw color={color} size={size} />}
                onPress={() => setLiveProgress(0)}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Sizes Showcase */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Progress Bar Sizes
              </Text>
              <Badge tone="accent">xs, sm, default, lg, xl</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Predefined bar height scale ranging from ultra-thin (xs = 4px) to thick (xl = 18px).
            </Text>

            <Box gap="md">
              <Box gap="xxs">
                <Text variant="caption" color="textMuted">
                  Extra Small (xs = 4px)
                </Text>
                <Progress value={85} size="xs" tone="success" />
              </Box>

              <Box gap="xxs">
                <Text variant="caption" color="textMuted">
                  Small (sm = 6px)
                </Text>
                <Progress value={70} size="sm" tone="primary" />
              </Box>

              <Box gap="xxs">
                <Text variant="caption" color="textMuted">
                  Default (10px)
                </Text>
                <Progress value={55} size="default" tone="warning" />
              </Box>

              <Box gap="xxs">
                <Text variant="caption" color="textMuted">
                  Large (lg = 14px)
                </Text>
                <Progress value={40} size="lg" tone="accent" />
              </Box>

              <Box gap="xxs">
                <Text variant="caption" color="textMuted">
                  Extra Large (xl = 18px)
                </Text>
                <Progress value={90} size="xl" tone="danger" />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Indeterminate & Circular Progress */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Indeterminate & Circular Progress Ring
              </Text>
              <Badge tone="success">Rounded Ring</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Continuous infinite loading animation and rounded SVG circular progress indicators.
            </Text>

            <Box gap="sm">
              <Text variant="caption" color="textMuted">
                Indeterminate Loading Bar
              </Text>
              <Progress indeterminate tone="primary" size="sm" />
            </Box>

            <Divider style={{ marginVertical: 4 }} />

            <Text variant="caption" color="textMuted">
              Rounded Circular Ring Indicators
            </Text>
            <Box row gap="lg" center style={{ justifyContent: "space-around" }}>
              <Box center gap="xs">
                <CircularProgress value={75} tone="primary" size={64} strokeLinecap="round" />
                <Text variant="caption" color="textMuted">
                  Primary 75%
                </Text>
              </Box>

              <Box center gap="xs">
                <CircularProgress value={92} tone="success" size={64} strokeLinecap="round" />
                <Text variant="caption" color="textMuted">
                  Done 92%
                </Text>
              </Box>

              <Box center gap="xs">
                <CircularProgress value={45} tone="warning" size={64} strokeLinecap="round" />
                <Text variant="caption" color="textMuted">
                  Pending 45%
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
