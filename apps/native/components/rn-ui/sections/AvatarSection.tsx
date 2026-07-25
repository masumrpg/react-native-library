import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Box,
  Card,
  Divider,
  Text,
} from "@masumdev/rn-ui";
import { Section, type RnUiSectionContext } from "../shared";

export function AvatarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { colors, styles } = ctx;

  return (
    <Section title="Avatar">
      <Card outlined>
        <Box gap="lg">
          <Text color="textMuted">
            User profile images supporting custom sizes (sm, default, lg),
            fallbacks, status badges, and overlapping groups.
          </Text>

          {/* Sizes and Badges */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Sizes and Badges
            </Text>
            <Box row gap="md" center style={styles.wrap}>
              {/* Large size with green online badge */}
              <Avatar size="lg">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  }}
                />
                <AvatarFallback>JD</AvatarFallback>
                <AvatarBadge bg={colors.success} />
              </Avatar>

              {/* Default size with default primary badge */}
              <Avatar size="default">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  }}
                />
                <AvatarFallback>AM</AvatarFallback>
                <AvatarBadge />
              </Avatar>

              {/* Small size with badge */}
              <Avatar size="sm">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
                  }}
                />
                <AvatarFallback>WL</AvatarFallback>
                <AvatarBadge bg={colors.warning} />
              </Avatar>

              {/* Fallback initials demonstration */}
              <Avatar size="default">
                <AvatarImage
                  source={{ uri: "https://invalid-url/broken.jpg" }}
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Box>
          </Box>

          <Divider />

          {/* Avatar Groups */}
          <Box gap="sm">
            <Text variant="labelSmall" color="textSubtle">
              Avatar Groups
            </Text>
            <Box gap="md">
              <AvatarGroup size="lg">
                <Avatar>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                    }}
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                    }}
                  />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
                    }}
                  />
                  <AvatarFallback>WL</AvatarFallback>
                </Avatar>
                <AvatarGroupCount count={3} />
              </AvatarGroup>

              <AvatarGroup size="default">
                <Avatar>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                    }}
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    source={{
                      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                    }}
                  />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <AvatarGroupCount count={5} />
              </AvatarGroup>
            </Box>
          </Box>
        </Box>
      </Card>
    </Section>
  );
}
