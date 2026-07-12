import React from "react";
import { Animated, Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  FileCode,
  FileText,
  Heart,
  HelpCircle,
  Moon,
  Palette,
  Plus,
  Settings,
  Smartphone,
  Sun,
  Trash,
  X,
} from "lucide-react-native";
import {
  Accordion,
  Alert,
  AlertDialog,
  AspectRatio,
  Attachment,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Box,
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Card,
  Divider,
  IconButton,
  Text,
  useTheme,
  useThemeStyles,
  type ColorSchemePreference,
  type RenderIcon,
} from "@masumdev/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) =>
    <Icon color={color} size={size} />;

const themeOptions: Array<{
  label: string;
  value: ColorSchemePreference;
  icon: RenderIcon;
}> = [
  { label: "Light", value: "light", icon: icon(Sun) },
  { label: "Dark", value: "dark", icon: icon(Moon) },
  { label: "System", value: "system", icon: icon(Smartphone) },
];

export default function RnUiScreen() {
  const router = useRouter();
  const [showAlertDetails, setShowAlertDetails] = React.useState(false);
  const [alertDialogVisible, setAlertDialogVisible] = React.useState(false);
  const [activeSegment, setActiveSegment] = React.useState<"weekly" | "monthly" | "yearly">("monthly");
  const [containerWidth, setContainerWidth] = React.useState(0);
  const slideAnim = React.useRef(new Animated.Value(1)).current;
  const {
    colors,
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
    toggleColorScheme,
    radii,
  } = useTheme();
  const styles = useStyles();

  React.useEffect(() => {
    const toValue = activeSegment === "weekly" ? 0 : activeSegment === "monthly" ? 1 : 2;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
  }, [activeSegment, slideAnim]);

  const padding = 3;
  const borderWidth = 2.5; // Double of 1.25 border width
  const innerWidth = containerWidth - (padding * 2) - borderWidth;
  const activeBlockWidth = innerWidth / 3;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, activeBlockWidth, activeBlockWidth * 2],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Box row center gap="md" style={styles.topBar}>
          <IconButton
            icon={icon(ArrowLeft)}
            variant="outline"
            onPress={() => router.back()}
          />
          <Box flex={1}>
            <Text variant="labelSmall" color="primary">
              @masumdev/rn-ui
            </Text>
            <Text variant="h3">Component Preview</Text>
          </Box>
          <View style={styles.headerSpacer} />
        </Box>

        <Card>
          <Box gap="md">
            <Box row center gap="sm">
              <Badge tone="accent" variant="solid" icon={icon(Palette)}>
                Themeable
              </Badge>
              <Badge tone="success" variant="soft" icon={icon(Check)}>
                Typed Tokens
              </Badge>
            </Box>

            <Text variant="h1">Reusable UI foundation</Text>
            <Text color="textMuted">
              Semua komponen di screen ini memakai token yang sama untuk color,
              typography, spacing, radius, shadow, dan dark mode.
            </Text>

            <Button
              size="lg"
              fullWidth
              rightIcon={icon(ChevronRight)}
              onPress={toggleColorScheme}
            >
              Toggle Light/Dark
            </Button>
          </Box>
        </Card>

        <Section title="Theme Provider">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Preference: {colorScheme}. Resolved: {resolvedColorScheme}.
              </Text>

              <Box row gap="sm" style={styles.wrap}>
                {themeOptions.map((item) => {
                  const active = colorScheme === item.value;

                  return (
                    <Button
                      key={item.value}
                      size="sm"
                      variant={active ? "filled" : "outline"}
                      leftIcon={item.icon}
                      onPress={() => setColorScheme(item.value)}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Text">
          <Card>
            <Box gap="sm">
              <Text variant="display">Display</Text>
              <Text variant="h1">Heading One</Text>
              <Text variant="h2">Heading Two</Text>
              <Text variant="h3">Heading Three</Text>
              <Text variant="title">Title text</Text>
              <Text variant="subtitle">Subtitle text</Text>
              <Text variant="body">Body text for normal content.</Text>
              <Text variant="bodySmall" color="textMuted">
                Small body text for secondary information.
              </Text>
              <Text variant="caption" color="textSubtle">
                Caption text for compact metadata.
              </Text>
            </Box>
          </Card>
        </Section>

        <Section title="Buttons">
          <Card>
            <Box gap="md">
              <Button leftIcon={icon(Plus)} fullWidth>
                Filled Primary
              </Button>
              <Button variant="outline" tone="secondary" fullWidth>
                Outline Secondary
              </Button>
              <Button variant="soft" tone="accent" leftIcon={icon(Heart)} fullWidth>
                Soft Accent
              </Button>
              <Button variant="ghost" tone="info" fullWidth>
                Ghost Info
              </Button>
              <Button variant="danger" fullWidth>
                Danger Action
              </Button>
              <Box row gap="sm" style={styles.wrap}>
                <Button size="xs">XS</Button>
                <Button size="sm">SM</Button>
                <Button size="md">MD</Button>
                <Button size="lg">LG</Button>
                <Button size="xl">XL</Button>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Icon Buttons">
          <Card>
            <Box row gap="md" center style={styles.wrap}>
              <IconButton icon={icon(ArrowLeft)} variant="ghost" />
              <IconButton icon={icon(Settings)} variant="outline" />
              <IconButton icon={icon(Heart)} variant="soft" />
              <IconButton icon={icon(Plus)} variant="filled" />
              <IconButton icon={icon(Heart)} variant="soft" badge={12} />
            </Box>
          </Card>
        </Section>

        <Section title="Badges">
          <Card>
            <Box gap="sm">
              <Box row gap="sm" style={styles.wrap}>
                <Badge tone="primary" variant="solid">
                  Primary
                </Badge>
                <Badge tone="secondary" variant="soft">
                  Secondary
                </Badge>
                <Badge tone="accent" variant="outline">
                  Accent
                </Badge>
              </Box>
              <Box row gap="sm" style={styles.wrap}>
                <Badge tone="success" icon={icon(Check)}>
                  Success
                </Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="info">Info</Badge>
              </Box>
              <Box row gap="sm" style={styles.wrap}>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Alert">
          <Box gap="md">
            <Alert
              tone="info"
              title="Information"
              icon={icon(CircleAlert)}
              action={{
                label: showAlertDetails ? "Hide details" : "View details",
                icon: ({ color, size }) => (
                  <AnimatedToggleIcon
                    color={color}
                    size={size}
                    expanded={showAlertDetails}
                    direction="down"
                  />
                ),
                onPress: () => setShowAlertDetails((value) => !value),
              }}
            >
              <Box gap="sm">
                <Text color="textMuted">
                  Alert uses semantic tones, flat borders, and pluggable icons.
                </Text>
                <AnimatedDetail visible={showAlertDetails}>
                  <Box
                    bg="infoSoft"
                    radius="lg"
                    p="md"
                    style={styles.alertDetailsBox}
                  >
                    <Text variant="bodySmall" color="textMuted">
                      Details can be controlled from app state through the
                      action callback. The Alert component stays generic.
                    </Text>
                  </Box>
                </AnimatedDetail>
              </Box>
            </Alert>

            <Alert
              tone="success"
              variant="outline"
              title="Success"
              icon={icon(Check)}
              closeIcon={icon(X)}
              dismissible
              onClose={() => undefined}
            >
              Use actions and close controls only when the app needs them.
            </Alert>

            <Alert tone="danger" variant="solid" title="Danger">
              Solid alerts are available for stronger feedback states.
            </Alert>
          </Box>
        </Section>

        <Section title="Alert Dialog">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Modal confirmation dialog with flat border styling, animated
                entry, backdrop dismiss, and pluggable icons.
              </Text>
              <Button
                variant="danger"
                leftIcon={icon(Trash)}
                onPress={() => setAlertDialogVisible(true)}
              >
                Open Delete Dialog
              </Button>
            </Box>
          </Card>
        </Section>

        <Section title="Accordion">
          <Accordion
            defaultOpenIds={["theme"]}
            items={[
              {
                id: "theme",
                title: "Theme tokens",
                subtitle: "Colors, fonts, spacing, radius, and component sizes",
                icon: icon(Palette),
                content:
                  "Accordion follows the same flat bordered style and automatically adapts to light or dark mode.",
              },
              {
                id: "icons",
                title: "Generic icons",
                subtitle: "No dependency on a specific icon package",
                icon: icon(HelpCircle),
                content: (
                  <Text color="textMuted">
                    Pass any React node or render function for item icons and
                    the expand indicator.
                  </Text>
                ),
              },
              {
                id: "controlled",
                title: "Controlled or uncontrolled",
                subtitle: "Use openIds for full state control",
                icon: icon(Settings),
                content:
                  "Use defaultOpenIds for quick setup, or openIds plus onOpenChange when state should live in the app.",
              },
            ]}
          />
        </Section>

        <Section title="Box, Card, Divider">
          <Card padded={false} outlined>
            <Box p="lg" gap="md">
              <Box row center gap="md">
                <Box
                  center
                  bg="primarySoft"
                  radius="lg"
                  style={styles.sampleTile}
                >
                  <Palette color={colors.primary} size={22} />
                </Box>
                <Box flex={1}>
                  <Text variant="subtitle">Composable layout primitives</Text>
                  <Text variant="bodySmall" color="textMuted">
                    Box handles common spacing, color, radius, and row layout.
                  </Text>
                </Box>
              </Box>

              <Divider />

              <Box row gap="sm">
                <Box flex={1} bg="backgroundMuted" radius="lg" p="md">
                  <Text variant="label">Surface A</Text>
                  <Text variant="caption" color="textMuted">
                    muted bg
                  </Text>
                </Box>
                <Box flex={1} bg="primarySoft" radius="lg" p="md">
                  <Text variant="label" color="primary">
                    Surface B
                  </Text>
                  <Text variant="caption" color="textMuted">
                    primary soft
                  </Text>
                </Box>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Aspect Ratio">
          <Card padded={false} outlined>
            <Box p="lg" gap="md">
              <Text color="textMuted">
                AspectRatio maintains specific proportions for images or layouts (e.g., 16/9, 4/3). Children will stretch to fill.
              </Text>
              <Box gap="md">
                <Text variant="labelSmall" color="textSubtle">16:9 Aspect Ratio with rounded corners</Text>
                <AspectRatio ratio={16 / 9} radius="lg">
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" }}
                    style={{ resizeMode: "cover" }}
                  />
                </AspectRatio>

                <Text variant="labelSmall" color="textSubtle" style={{ marginTop: 8 }}>4:3 Aspect Ratio</Text>
                <AspectRatio ratio={4 / 3} radius="lg">
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80" }}
                    style={{ resizeMode: "cover" }}
                  />
                </AspectRatio>

                <Text variant="labelSmall" color="textSubtle" style={{ marginTop: 8 }}>1:1 Aspect Ratio (Square)</Text>
                <AspectRatio ratio={1} radius="lg" style={{ width: 120 }}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" }}
                    style={{ resizeMode: "cover" }}
                  />
                </AspectRatio>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Attachments">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                File attachments preview supporting grid-like Card views and full-width list Row views.
              </Text>

              {/* Grid-like layout matching the reference image */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Image Previews (Card Layout)</Text>
                <Box row gap="sm" style={styles.wrap}>
                  <Attachment
                    layout="card"
                    name="workspace.png"
                    description="PNG • 820 KB"
                    thumbnail="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80"
                  />
                  <Attachment
                    layout="card"
                    name="desk-reference.jpg"
                    description="JPG • 1.1 MB"
                    thumbnail="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=200&q=80"
                  />
                  <Attachment
                    layout="card"
                    name="office-reference.jpg"
                    description="JPG • 940 KB"
                    thumbnail="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=200&q=80"
                  />
                </Box>
              </Box>

              <Divider />

              {/* List layout matching reference image */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Document Previews (Row Layout)</Text>
                <Box gap="sm">
                  <Attachment
                    layout="row"
                    name="sales-dashboard.pdf"
                    description="Uploading • 64%"
                    loading={true}
                    onRemove={() => undefined}
                    closeIcon={icon(X)}
                  />
                  <Attachment
                    layout="row"
                    name="message-renderer.tsx"
                    description="TypeScript • 12 KB"
                    thumbnail={icon(FileCode)}
                    onRemove={() => undefined}
                    closeIcon={icon(X)}
                  />
                </Box>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Avatar">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                User profile images supporting custom sizes (sm, default, lg), fallbacks, status badges, and overlapping groups.
              </Text>

              {/* Sizes and Badges */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Sizes and Badges</Text>
                <Box row gap="md" center style={styles.wrap}>
                  {/* Large size with green online badge */}
                  <Avatar size="lg">
                    <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }} />
                    <AvatarFallback>JD</AvatarFallback>
                    <AvatarBadge bg={colors.success} />
                  </Avatar>

                  {/* Default size with default primary badge */}
                  <Avatar size="default">
                    <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }} />
                    <AvatarFallback>AM</AvatarFallback>
                    <AvatarBadge />
                  </Avatar>

                  {/* Small size with badge */}
                  <Avatar size="sm">
                    <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" }} />
                    <AvatarFallback>WL</AvatarFallback>
                    <AvatarBadge bg={colors.warning} />
                  </Avatar>

                  {/* Fallback initials demonstration */}
                  <Avatar size="default">
                    <AvatarImage source={{ uri: "https://invalid-url/broken.jpg" }} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Box>
              </Box>

              <Divider />

              {/* Avatar Groups */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Avatar Groups</Text>
                <Box gap="md">
                  <AvatarGroup size="lg">
                    <Avatar>
                      <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }} />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80" }} />
                      <AvatarFallback>WL</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount count={3} />
                  </AvatarGroup>

                  <AvatarGroup size="default">
                    <Avatar>
                      <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" }} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" }} />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount count={5} />
                  </AvatarGroup>
                </Box>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Chat Bubbles">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                Message layout components supporting start/end alignment, multiple tone variants, and reaction overlay tags.
              </Text>

              <BubbleGroup>
                {/* Incoming message */}
                <Box row gap="sm" style={{ alignSelf: "flex-start", alignItems: "flex-end" }}>
                  <Avatar size="sm">
                    <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" }} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Bubble align="start" variant="secondary">
                    <BubbleContent>
                      Hai! Apakah kamu bisa bantu saya memahami cara kustomisasi tema warna di pustaka ini?
                    </BubbleContent>
                  </Bubble>
                </Box>

                {/* Outgoing message */}
                <Bubble align="end" variant="default">
                  <BubbleContent>
                    Tentu! Kamu cukup buat objek tema baru dan oper ke ThemeProvider. Contoh lengkapnya ada di dokumentasi README.
                  </BubbleContent>
                  <BubbleReactions side="bottom" align="end">
                    <Text style={{ fontSize: 11 }}>👍 2</Text>
                  </BubbleReactions>
                </Bubble>

                {/* Outgoing follow-up */}
                <Bubble align="end" variant="tinted">
                  <BubbleContent>
                    Apakah penjelasan ini cukup membantu? 😊
                  </BubbleContent>
                  <BubbleReactions side="bottom" align="end">
                    <Text style={{ fontSize: 11 }}>❤️ 1</Text>
                  </BubbleReactions>
                </Bubble>

                {/* Incoming message with warning/destructive alert */}
                <Box row gap="sm" style={{ alignSelf: "flex-start", alignItems: "flex-end", marginTop: 8 }}>
                  <Avatar size="sm">
                    <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" }} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Bubble align="start" variant="destructive">
                    <BubbleContent>
                      Wah, kelihatannya ada yang salah di setup saya. Warnanya tidak mau ganti.
                    </BubbleContent>
                    <BubbleReactions side="bottom" align="start">
                      <Text style={{ fontSize: 11 }}>😢 1</Text>
                    </BubbleReactions>
                  </Bubble>
                </Box>

                {/* Outgoing message with outline variant */}
                <Bubble align="end" variant="outline">
                  <BubbleContent>
                    Coba pastikan berkas konfigurasi tsconfig sudah benar dan build ulang projectnya.
                  </BubbleContent>
                </Bubble>
              </BubbleGroup>
            </Box>
          </Card>
        </Section>

        <Section title="Button Groups">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                Layout containers to group multiple buttons, inputs, or static text boxes with unified border-radii.
              </Text>

              {/* Horizontal Button Group */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Horizontal Orientation</Text>
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
                <Text variant="labelSmall" color="textSubtle">Segmented Actions (Animated)</Text>
                <ButtonGroup
                  orientation="horizontal"
                  style={{
                    backgroundColor: colors.backgroundMuted,
                    borderRadius: radii.lg,
                    borderWidth: 1.25,
                    borderColor: colors.border,
                    position: "relative",
                    overflow: "hidden",
                    padding: padding,
                  }}
                  onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
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
                      color: activeSegment === "weekly" ? colors.onPrimary : colors.textMuted,
                    }}
                    onPress={() => setActiveSegment("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    variant="ghost"
                    style={{ flex: 1 }}
                    textStyle={{
                      color: activeSegment === "monthly" ? colors.onPrimary : colors.textMuted,
                    }}
                    onPress={() => setActiveSegment("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant="ghost"
                    style={{ flex: 1 }}
                    textStyle={{
                      color: activeSegment === "yearly" ? colors.onPrimary : colors.textMuted,
                    }}
                    onPress={() => setActiveSegment("yearly")}
                  >
                    Yearly
                  </Button>
                </ButtonGroup>
              </Box>

              {/* Vertical Button Group */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Vertical Orientation</Text>
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
      </ScrollView>

      <AlertDialog
        visible={alertDialogVisible}
        tone="danger"
        title="Delete component sample?"
        description="This is a sample destructive confirmation. The dialog uses RN Modal and Animated by default."
        icon={icon(Trash)}
        closeIcon={icon(X)}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setAlertDialogVisible(false)}
        onCancel={() => setAlertDialogVisible(false)}
        onConfirm={() => setAlertDialogVisible(false)}
      />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  return (
    <Box gap="sm">
      <Text variant="labelSmall" color="textSubtle" style={{ textTransform: "uppercase" }}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

function AnimatedDetail({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ComponentProps<typeof Box>["children"];
}) {
  const progress = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = React.useState(0);
  const [shouldRender, setShouldRender] = React.useState(visible);

  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setShouldRender(false);
      }
    });
  }, [progress, visible]);

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  if (!shouldRender && !visible) {
    return null;
  }

  return (
    <Animated.View style={{ height, opacity: progress, overflow: "hidden" }}>
      <View
        style={{ position: "absolute", left: 0, right: 0 }}
        onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
      >
        {children}
      </View>
    </Animated.View>
  );
}

function AnimatedToggleIcon({
  expanded,
  color,
  size,
  direction = "down",
}: {
  expanded: boolean;
  color: string;
  size: number;
  direction?: "down" | "up" | "left";
}) {
  const progress = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [expanded, progress]);

  const outputRange =
    direction === "up"
      ? ["0deg", "-90deg"]
      : direction === "left"
        ? ["0deg", "180deg"]
        : ["0deg", "90deg"];

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange,
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <ChevronRight color={color} size={size} />
    </Animated.View>
  );
}

function useStyles() {
  return useThemeStyles((theme) => ({
    safeArea: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    topBar: {
      minHeight: 48,
    },
    headerSpacer: {
      width: theme.components.iconButton.size.md,
    },
    wrap: {
      flexWrap: "wrap",
    },
    sampleTile: {
      width: 48,
      height: 48,
    },
    alertDetailsBox: {
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.info,
    },
  }));
}
