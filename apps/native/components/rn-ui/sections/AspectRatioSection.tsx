import { AspectRatio, Box, Card, Text } from "@masumdev/rn-ui";
import { Image } from "react-native";
import { Section, type RnUiSectionContext } from "../shared";

export function AspectRatioSection({ ctx: _ctx }: { ctx: RnUiSectionContext }) {
  return (
    <Section title="Aspect Ratio">
      <Card padded={false} outlined>
        <Box p="lg" gap="md">
          <Text color="textMuted">
            AspectRatio maintains specific proportions for images or layouts
            (e.g., 16/9, 4/3). Children will stretch to fill.
          </Text>
          <Box gap="md">
            <Text variant="labelSmall" color="textSubtle">
              16:9 Aspect Ratio with rounded corners
            </Text>
            <AspectRatio ratio={16 / 9} radius="lg">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
                }}
                style={{ resizeMode: "cover" }}
              />
            </AspectRatio>

            <Text
              variant="labelSmall"
              color="textSubtle"
              style={{ marginTop: 8 }}
            >
              4:3 Aspect Ratio
            </Text>
            <AspectRatio ratio={4 / 3} radius="lg">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80",
                }}
                style={{ resizeMode: "cover" }}
              />
            </AspectRatio>

            <Text
              variant="labelSmall"
              color="textSubtle"
              style={{ marginTop: 8 }}
            >
              1:1 Aspect Ratio (Square)
            </Text>
            <AspectRatio ratio={1} radius="lg" style={{ width: 120 }}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                }}
                style={{ resizeMode: "cover" }}
              />
            </AspectRatio>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
