import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Box,
  Card,
  Divider,
  Text,
} from "@masumdev/rn-ui";
import React from "react";
import { Section, type RnUiSectionContext } from "../shared";

export function AvatarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles } = ctx;

  const sampleUsers = [
    {
      name: "Jane Doe",
      initials: "JD",
      uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Alex Miller",
      initials: "AM",
      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    {
      name: "Wilson Lee",
      initials: "WL",
      uri: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <Section title="Avatar">
      <Box gap="xl">
        {/* Sizes and Status Badges */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Avatar Sizes & Status Badges
              </Text>
              <Badge tone="primary">sm, default, lg, xl</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Supports 4 predefined sizes (sm = 28px, default = 36px, lg = 44px, xl = 56px) with online, busy, away, and offline status indicators.
            </Text>

            <Box row gap="lg" center style={styles.wrap}>
              {/* Extra Large (XL) with Online Status */}
              <Box center gap="xs">
                <Avatar size="xl">
                  <AvatarImage source={{ uri: sampleUsers[0].uri }} />
                  <AvatarFallback>{sampleUsers[0].initials}</AvatarFallback>
                  <AvatarBadge status="online" />
                </Avatar>
                <Text variant="caption" color="textMuted">
                  xl (56px)
                </Text>
              </Box>

              {/* Large (LG) with Busy Status */}
              <Box center gap="xs">
                <Avatar size="lg">
                  <AvatarImage source={{ uri: sampleUsers[1].uri }} />
                  <AvatarFallback>{sampleUsers[1].initials}</AvatarFallback>
                  <AvatarBadge status="busy" />
                </Avatar>
                <Text variant="caption" color="textMuted">
                  lg (44px)
                </Text>
              </Box>

              {/* Default with Away Status */}
              <Box center gap="xs">
                <Avatar size="default">
                  <AvatarImage source={{ uri: sampleUsers[2].uri }} />
                  <AvatarFallback>{sampleUsers[2].initials}</AvatarFallback>
                  <AvatarBadge status="away" />
                </Avatar>
                <Text variant="caption" color="textMuted">
                  default (36px)
                </Text>
              </Box>

              {/* Small (SM) with Offline Status */}
              <Box center gap="xs">
                <Avatar size="sm">
                  <AvatarImage source={{ uri: sampleUsers[0].uri }} />
                  <AvatarFallback>{sampleUsers[0].initials}</AvatarFallback>
                  <AvatarBadge status="offline" />
                </Avatar>
                <Text variant="caption" color="textMuted">
                  sm (28px)
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Shapes & Fallbacks */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Shapes & Broken Image Fallbacks
              </Text>
              <Badge tone="accent">Circle, Square, Rounded</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Configurable shapes (circle, square, rounded) with automatic fallback text when network image fails.
            </Text>

            <Box row gap="lg" center style={styles.wrap}>
              {/* Circle shape */}
              <Box center gap="xs">
                <Avatar size="lg" shape="circle">
                  <AvatarImage source={{ uri: sampleUsers[0].uri }} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Circle
                </Text>
              </Box>

              {/* Rounded shape */}
              <Box center gap="xs">
                <Avatar size="lg" shape="rounded">
                  <AvatarImage source={{ uri: sampleUsers[1].uri }} />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Rounded
                </Text>
              </Box>

              {/* Square shape */}
              <Box center gap="xs">
                <Avatar size="lg" shape="square">
                  <AvatarImage source={{ uri: sampleUsers[2].uri }} />
                  <AvatarFallback>WL</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Square
                </Text>
              </Box>

              {/* Broken Image Fallback */}
              <Box center gap="xs">
                <Avatar size="lg" shape="circle">
                  <AvatarImage source={{ uri: "https://invalid-broken-url/img.jpg" }} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Fallback Initials
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Overlapping Avatar Groups */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Overlapping Avatar Groups
              </Text>
              <Badge tone="success">Avatar Group</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Stacked avatars with ring borders and remaining user counts.
            </Text>

            <Box gap="md">
              <Box gap="xs">
                <Text variant="caption" color="textMuted">
                  XL Group (+3 members)
                </Text>
                <AvatarGroup size="xl">
                  {sampleUsers.map((u, i) => (
                    <Avatar key={i}>
                      <AvatarImage source={{ uri: u.uri }} />
                      <AvatarFallback>{u.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  <AvatarGroupCount count={3} />
                </AvatarGroup>
              </Box>

              <Divider style={{ marginVertical: 4 }} />

              <Box gap="xs">
                <Text variant="caption" color="textMuted">
                  Rounded Shape Group (+8 members)
                </Text>
                <AvatarGroup size="lg" shape="rounded">
                  {sampleUsers.map((u, i) => (
                    <Avatar key={i}>
                      <AvatarImage source={{ uri: u.uri }} />
                      <AvatarFallback>{u.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                  <AvatarGroupCount count={8} />
                </AvatarGroup>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Section>
  );
}
