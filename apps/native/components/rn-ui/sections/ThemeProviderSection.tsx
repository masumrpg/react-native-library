import { Box, Button, Card, Text } from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function ThemeProviderSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    styles,
    themeOptions,
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
  } = ctx;

  return (
    <Section title="Theme Provider">
      <Card>
        <Box gap="md">
          <Text color="textMuted">
            Preference: {colorScheme}. Resolved: {resolvedColorScheme}.
          </Text>

          <Box row gap="sm" style={styles.wrap}>
            {(
              (themeOptions as Array<{
                label: string;
                value: string;
                icon?: (props: { size: number; color: string }) => React.ReactNode;
              }>) || []
            ).map((item) => {
              const active = colorScheme === item.value;

              return (
                <Button
                  key={item.value}
                  size="sm"
                  variant={active ? "filled" : "outline"}
                  leftIcon={item.icon as never}
                  onPress={() => (setColorScheme as (val: string) => void)(item.value)}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
