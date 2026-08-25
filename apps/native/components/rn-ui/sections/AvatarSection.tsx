import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarFrame,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Box,
  Card,
  Divider,
  Text,
} from "@masumdev/rn-ui";
import { Crown, Flame, Sparkles } from "lucide-react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { SAMPLE_ASSETS, Section, type RnUiSectionContext } from "../shared";

// Custom SVG VIP Crown Ornate Frame (matching reference image)
function VipOrnateFrameSvg({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="30%" stopColor="#F59E0B" />
          <Stop offset="70%" stopColor="#D97706" />
          <Stop offset="100%" stopColor="#FEF3C7" />
        </LinearGradient>
        <LinearGradient id="goldFiligree" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#B45309" />
          <Stop offset="50%" stopColor="#FBBF24" />
          <Stop offset="100%" stopColor="#78350F" />
        </LinearGradient>
      </Defs>
      {/* Outer ornate glow circle */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#goldFiligree)"
        strokeWidth="2.5"
        strokeDasharray="3 2"
      />
      {/* Main gold frame ring */}
      <Circle cx="50" cy="50" r="41" stroke="url(#goldGrad)" strokeWidth="4" />
      {/* Inner accent ring */}
      <Circle cx="50" cy="50" r="37.5" stroke="#78350F" strokeWidth="1" />
      {/* Crown emblem at top */}
      <Path
        d="M38 18 L43 24 L50 16 L57 24 L62 18 L60 27 L40 27 Z"
        fill="url(#goldGrad)"
        stroke="#78350F"
        strokeWidth="1"
      />
      {/* Diamond gemstones on left, right, bottom */}
      <Path
        d="M8 50 L12 46 L16 50 L12 54 Z"
        fill="#FFFFFF"
        stroke="url(#goldGrad)"
        strokeWidth="1"
      />
      <Path
        d="M84 50 L88 46 L92 50 L88 54 Z"
        fill="#FFFFFF"
        stroke="url(#goldGrad)"
        strokeWidth="1"
      />
      <Path
        d="M50 87 L54 91 L50 95 L46 91 Z"
        fill="#FFFFFF"
        stroke="url(#goldGrad)"
        strokeWidth="1"
      />
    </Svg>
  );
}

// Custom Platinum Diamond Crest Frame (matching reference image)
function PlatinumCrestFrameSvg({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="40%" stopColor="#CBD5E1" />
          <Stop offset="70%" stopColor="#94A3B8" />
          <Stop offset="100%" stopColor="#E2E8F0" />
        </LinearGradient>
      </Defs>
      {/* Outer ornate filigree circle */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#platGrad)"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      {/* Main platinum frame ring */}
      <Circle
        cx="50"
        cy="50"
        r="41"
        stroke="url(#platGrad)"
        strokeWidth="4.5"
      />
      {/* Inner crisp ring */}
      <Circle cx="50" cy="50" r="37" stroke="#334155" strokeWidth="1.2" />
      {/* Diamond gem at top */}
      <Path
        d="M50 12 L58 19 L50 26 L42 19 Z"
        fill="#E0F2FE"
        stroke="#38BDF8"
        strokeWidth="1.2"
      />
      {/* Filigree bottom ribbon */}
      <Path
        d="M32 86 Q50 94 68 86 Q50 98 32 86 Z"
        fill="url(#platGrad)"
        stroke="#475569"
        strokeWidth="1"
      />
    </Svg>
  );
}

export function AvatarSection({ ctx }: { ctx: RnUiSectionContext }) {
  const { styles } = ctx;

  const sampleUsers = [
    {
      name: SAMPLE_ASSETS.avatarName,
      initials: SAMPLE_ASSETS.avatarInitials,
      uri: SAMPLE_ASSETS.avatarUrl,
    },
    {
      name: SAMPLE_ASSETS.avatarName,
      initials: SAMPLE_ASSETS.avatarInitials,
      uri: SAMPLE_ASSETS.avatarUrl,
    },
    {
      name: SAMPLE_ASSETS.avatarName,
      initials: SAMPLE_ASSETS.avatarInitials,
      uri: SAMPLE_ASSETS.avatarUrl,
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
                  <AvatarFallback>{sampleUsers[0].initials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Circle
                </Text>
              </Box>

              {/* Rounded shape */}
              <Box center gap="xs">
                <Avatar size="lg" shape="rounded">
                  <AvatarImage source={{ uri: sampleUsers[1].uri }} />
                  <AvatarFallback>{sampleUsers[1].initials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Rounded
                </Text>
              </Box>

              {/* Square shape */}
              <Box center gap="xs">
                <Avatar size="lg" shape="square">
                  <AvatarImage source={{ uri: sampleUsers[2].uri }} />
                  <AvatarFallback>{sampleUsers[2].initials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Square
                </Text>
              </Box>

              {/* Broken Image Fallback */}
              <Box center gap="xs">
                <Avatar size="lg" shape="circle">
                  <AvatarImage source={{ uri: "https://invalid-broken-url/img.jpg" }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Fallback Initials
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Notification & Decor Badges */}
        <Card outlined>
          <Box gap="md">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Notification & Decor Badges
              </Text>
              <Badge tone="danger">Count, Status, Custom</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Flexible badge support: pass count numbers (e.g. 1, 99+), custom text, or custom decorative icon components.
            </Text>

            <Box row gap="xl" center style={styles.wrap}>
              {/* Message count 1 */}
              <Box center gap="xs">
                <Avatar size="lg" badge={1} badgeTone="danger">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  1 Message
                </Text>
              </Box>

              {/* Message count 5 (Primary tone) */}
              <Box center gap="xs">
                <Avatar size="lg" badge={5} badgeTone="primary">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  5 Unread
                </Text>
              </Box>

              {/* Overflow count 99+ */}
              <Box center gap="xs">
                <Avatar size="xl" badge={120} badgeTone="danger">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  99+ Overflow
                </Text>
              </Box>

              {/* Text Badge (PRO) */}
              <Box center gap="xs">
                <Avatar size="lg" badge="PRO" badgeTone="accent">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Text Badge
                </Text>
              </Box>

              {/* Custom Decor Badge with Sparkles/Crown Component */}
              <Box center gap="xs">
                <Avatar size="xl">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  <AvatarBadge tone="warning" position="top-right">
                    <Sparkles size={11} color="#FFFFFF" />
                  </AvatarBadge>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Custom Icon
                </Text>
              </Box>

              {/* Flame / Activity Badge */}
              <Box center gap="xs">
                <Avatar size="lg">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  <AvatarBadge tone="danger" position="bottom-right">
                    <Flame size={10} color="#FFFFFF" />
                  </AvatarBadge>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Streak Decor
                </Text>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Bordered, VIP & Premium Ring Variants */}
        <Card outlined>
          <Box gap="lg">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                VIP, Gold, Premium & Bordered Variants
              </Text>
              <Badge tone="accent">basic, vip, gold, premium</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Elevate user profiles with basic default frames, vibrant borders, social story rings, luxurious VIP Gold, and royal Premium frames across all shapes.
            </Text>

            {/* Circular Frames */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Circular Frames & Luxury Badges
              </Text>
              <Box row gap="xl" center style={styles.wrap}>
                {/* Basic / Default */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="default">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Basic
                  </Text>
                </Box>

                {/* Gold Border */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="bordered" tone="gold">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Gold Border
                  </Text>
                </Box>

                {/* VIP Gold Edition */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="vip">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                    <AvatarBadge tone="warning" position="top-right">
                      <Crown size={11} color="#FFFFFF" />
                    </AvatarBadge>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    VIP Gold
                  </Text>
                </Box>

                {/* Premium Royal Edition */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="premium">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                    <AvatarBadge tone="secondary" position="top-right">
                      <Sparkles size={11} color="#FFFFFF" />
                    </AvatarBadge>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Premium
                  </Text>
                </Box>

                {/* Story Ring Accent */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="ring" tone="accent">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Story Ring
                  </Text>
                </Box>

                {/* Online Status Bordered */}
                <Box center gap="xs">
                  <Avatar size="xl" variant="bordered" tone="success">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                    <AvatarBadge status="online" />
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Online VIP
                  </Text>
                </Box>
              </Box>
            </Box>

            <Divider style={{ marginVertical: 4 }} />

            {/* Shape-Aware Luxury Frames (Rounded & Square) */}
            <Box gap="xs">
              <Text variant="caption" color="textMuted">
                Rounded & Square Luxury Frames
              </Text>
              <Box row gap="xl" center style={styles.wrap}>
                {/* Rounded VIP */}
                <Box center gap="xs">
                  <Avatar size="xl" shape="rounded" variant="vip">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                    <AvatarBadge tone="warning" position="top-right">
                      <Crown size={11} color="#FFFFFF" />
                    </AvatarBadge>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    VIP Rounded
                  </Text>
                </Box>

                {/* Square Premium */}
                <Box center gap="xs">
                  <Avatar size="xl" shape="square" variant="premium">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                    <AvatarBadge tone="secondary" position="top-right">
                      <Sparkles size={11} color="#FFFFFF" />
                    </AvatarBadge>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Square Premium
                  </Text>
                </Box>

                {/* Gold Ring Rounded */}
                <Box center gap="xs">
                  <Avatar size="xl" shape="rounded" variant="ring" tone="gold">
                    <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                    <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <Text variant="caption" color="textMuted">
                    Gold Ring
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Custom Ornate Frames & Overlays */}
        <Card outlined>
          <Box gap="lg">
            <Box row center style={{ justifyContent: "space-between" }}>
              <Text weight="700" color="text">
                Custom Ornate Frames & Overlays
              </Text>
              <Badge tone="warning">frame, &lt;AvatarFrame&gt;</Badge>
            </Box>
            <Text color="textMuted" variant="bodySmall">
              Create game/VIP style customized avatar frames using SVGs, custom components, or remote PNG frame assets.
            </Text>

            <Box row gap="xl" center style={styles.wrap}>
              {/* VIP Gold Ornate Crown Frame */}
              <Box center gap="xs">
                <Avatar
                  size="xl"
                  frame={<VipOrnateFrameSvg size={78} />}
                  frameScale={1.4}
                >
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  VIP Crown Frame
                </Text>
              </Box>

              {/* Platinum Diamond Crest Frame */}
              <Box center gap="xs">
                <Avatar
                  size="xl"
                  frame={<PlatinumCrestFrameSvg size={78} />}
                  frameScale={1.4}
                >
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  Platinum Crest
                </Text>
              </Box>

              {/* Explicit AvatarFrame subcomponent */}
              <Box center gap="xs">
                <Avatar size="xl">
                  <AvatarImage source={{ uri: SAMPLE_ASSETS.avatarUrl }} />
                  <AvatarFallback>{SAMPLE_ASSETS.avatarInitials}</AvatarFallback>
                  <AvatarFrame scale={1.42}>
                    <VipOrnateFrameSvg size={80} />
                  </AvatarFrame>
                  <AvatarBadge tone="warning" position="top-right">
                    <Sparkles size={11} color="#FFFFFF" />
                  </AvatarBadge>
                </Avatar>
                <Text variant="caption" color="textMuted">
                  &lt;AvatarFrame&gt;
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
