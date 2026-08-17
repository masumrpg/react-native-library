import {
  Box,
  Card,
  Rating,
  Text,
  type RatingShape,
} from "@masumdev/rn-ui";
import { Sparkles } from "lucide-react-native";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function RatingSection({ ctx }: { ctx: RnUiSectionContext }) {
  const [starRating, setStarRating] = React.useState(4);
  const [halfRating, setHalfRating] = React.useState(3.5);
  const [heartRating, setHeartRating] = React.useState(5);

  return (
    <Section title="Rating">
      <Card>
        <Box gap="lg">
          {/* Default Star Rating with Full Precision */}
          <Box gap="xs">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text variant="label">Standard Star Rating (Full Step)</Text>
              <Text variant="labelSmall" color="textMuted">
                {starRating} / 5
              </Text>
            </Box>
            <Text variant="bodySmall" color="textMuted">
              Interactive tap & drag gesture with spring scale animation.
            </Text>
            <Rating
              value={starRating}
              precision="full"
              size="lg"
              showValue
              onValueChange={setStarRating}
            />
          </Box>

          {/* Half Precision Star Rating */}
          <Box gap="xs">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text variant="label">Half Star Precision (0.5 Step)</Text>
              <Text variant="labelSmall" color="textMuted">
                {halfRating} / 5
              </Text>
            </Box>
            <Rating
              value={halfRating}
              precision="half"
              size="lg"
              tone="warning"
              showValue
              onValueChange={setHalfRating}
            />
          </Box>

          {/* Heart Shape Rating */}
          <Box gap="xs">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text variant="label">Heart Shape (Love / Favorite)</Text>
              <Text variant="labelSmall" color="danger">
                {heartRating} / 5 ❤️
              </Text>
            </Box>
            <Rating
              value={heartRating}
              shape="heart"
              precision="full"
              size="lg"
              tone="danger"
              showValue
              onValueChange={setHeartRating}
            />
          </Box>

          {/* Multi-shape showcase */}
          <Box gap="xs">
            <Text variant="label">Preset Shapes</Text>
            <Text variant="bodySmall" color="textMuted">
              Star, Heart, Thumb, Fire, Smile, Shield presets out of the box.
            </Text>
            <Box style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, marginTop: 4 }}>
              <Box center gap="xs">
                <Rating shape="star" value={4} size="md" readOnly />
                <Text variant="caption" color="textMuted">Star</Text>
              </Box>
              <Box center gap="xs">
                <Rating shape="heart" value={5} size="md" readOnly />
                <Text variant="caption" color="textMuted">Heart</Text>
              </Box>
              <Box center gap="xs">
                <Rating shape="thumb" value={4} size="md" readOnly />
                <Text variant="caption" color="textMuted">Thumb</Text>
              </Box>
              <Box center gap="xs">
                <Rating shape="fire" value={5} size="md" readOnly />
                <Text variant="caption" color="textMuted">Fire</Text>
              </Box>
              <Box center gap="xs">
                <Rating shape="smile" value={4} size="md" readOnly />
                <Text variant="caption" color="textMuted">Smile</Text>
              </Box>
              <Box center gap="xs">
                <Rating shape="shield" value={5} size="md" readOnly />
                <Text variant="caption" color="textMuted">Shield</Text>
              </Box>
            </Box>
          </Box>

          {/* Exact Precision & Custom Render Item */}
          <Box gap="xs">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text variant="label">Exact Fractional Review Display (4.7)</Text>
              <Text variant="labelSmall" color="textMuted">
                Read-only display
              </Text>
            </Box>
            <Rating
              value={4.7}
              precision="exact"
              size="xl"
              readOnly
              showValue
              valueFormat={(val, max) => `${val.toFixed(1)} / ${max} (1,248 reviews)`}
            />
          </Box>

          {/* Custom RenderIcon from Lucide */}
          <Box gap="xs">
            <Text variant="label">Custom Lucide Icon Support</Text>
            <Rating
              value={4}
              size="lg"
              color="#A855F7"
              icon={({ color, size }) => <Sparkles color={color} size={size} />}
              showValue
            />
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
