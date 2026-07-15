import React from "react";
import { Animated, Image, View, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  Copy,
  EyeOff,
  FileCode,
  FileText,
  Heart,
  HelpCircle,
  Inbox,
  Moon,
  Palette,
  Plus,
  Settings,
  Smartphone,
  Search,
  Sun,
  Trash,
  X,
  ChevronsUpDown,
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
  BottomSheet,
  BottomSheetView,
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Checkbox,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  Card,
  Divider,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  IconButton,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  KeyboardAvoiding,
  Text,
  useTheme,
  useThemeStyles,
  type BottomSheetMethods,
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
  const [selectedDate, setSelectedDate] = React.useState("2026-07-15");
  const [rangeStart, setRangeStart] = React.useState<string | null>("2026-07-08");
  const [rangeEnd, setRangeEnd] = React.useState<string | null>("2026-07-11");
  const [checkOne, setCheckOne] = React.useState(false);
  const [checkTwo, setCheckTwo] = React.useState(true);
  const [framework, setFramework] = React.useState("");
  const [sampleInput, setSampleInput] = React.useState("Expo React Native by Ma'sum");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [otpValue, setOtpValue] = React.useState("2026");
  const [showBookmark, setShowBookmark] = React.useState(true);
  const [compactMenu, setCompactMenu] = React.useState(false);
  const bottomSheetRef = React.useRef<BottomSheetMethods>(null);
  const bottomSheetSnapPoints = React.useMemo(() => ["35%", "70%"], []);

  const handleRangePress = (day: { dateString: string }) => {
    const { dateString } = day;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateString);
      setRangeEnd(null);
    } else {
      if (new Date(dateString) < new Date(rangeStart)) {
        setRangeStart(dateString);
      } else {
        setRangeEnd(dateString);
      }
    }
  };

  const getRangeMarkedDates = (start: string | null, end: string | null) => {
    const marked: Record<string, any> = {};
    if (start) {
      marked[start] = { selected: true, startingDay: true };
    }
    if (end && start) {
      marked[end] = { selected: true, endingDay: true };

      // Generate date strings between start and end
      let current = new Date(start);
      const endDate = new Date(end);
      current.setDate(current.getDate() + 1);

      while (current < endDate) {
        const dateString = current.toISOString().split("T")[0];
        marked[dateString] = { selected: true, isMiddle: true };
        current.setDate(current.getDate() + 1);
      }
    }
    return marked;
  };
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
      <KeyboardAvoiding
        scroll
        bg="background"
        contentContainerStyle={styles.content}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
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
                  onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
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

        <Section title="Calendar">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                Date selector calendar utilizing wix react-native-calendars styled with our themed custom day cells.
              </Text>

              {/* Single selection calendar */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Single Selection & Today</Text>
                <Calendar
                  current="2026-07-12"
                  markedDates={{
                    [selectedDate]: { selected: true },
                  }}
                  onDayPress={(day: any) => setSelectedDate(day.dateString)}
                />
                <Text variant="bodySmall" color="textMuted" style={{ marginTop: 4 }}>
                  Selected Date: <Text variant="bodySmall" color="primary" style={{ fontWeight: "600" }}>{selectedDate}</Text>
                </Text>
              </Box>

              {/* Range selection calendar */}
              <Box gap="sm">
                <Text variant="labelSmall" color="textSubtle">Range Selection (Period Marking)</Text>
                <Calendar
                  current="2026-07-12"
                  markedDates={getRangeMarkedDates(rangeStart, rangeEnd)}
                  onDayPress={handleRangePress}
                />
                <Text variant="bodySmall" color="textMuted" style={{ marginTop: 4 }}>
                  Selected Range: <Text variant="bodySmall" color="primary" style={{ fontWeight: "600" }}>{rangeStart || "None"}</Text> to <Text variant="bodySmall" color="primary" style={{ fontWeight: "600" }}>{rangeEnd || "None"}</Text>
                </Text>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Carousel">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                A horizontal deck-style slideshow with dramatic card scaling, opacity transitions, active dot pagination, and optional side arrow triggers.
              </Text>

              <Box style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
                <Carousel>
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <Card outlined style={{ width: 240, height: 130, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
                          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.primary }}>
                            Slide {index + 1}
                          </Text>
                          <Text variant="bodySmall" color="textSubtle" style={{ marginTop: 4 }}>
                            Swipe or press arrows to navigate
                          </Text>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Checkbox">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                Accessible checkbox inputs with active focus colors, disabled states, and invalid/destructive outlines.
              </Text>

              <Box gap="md">
                <Box row center gap="sm">
                  <Checkbox checked={checkOne} onCheckedChange={setCheckOne} />
                  <Text style={{ fontSize: 14 }}>Default Unchecked ({checkOne ? "checked" : "unchecked"})</Text>
                </Box>

                <Box row center gap="sm">
                  <Checkbox checked={checkTwo} onCheckedChange={setCheckTwo} />
                  <Text style={{ fontSize: 14 }}>Default Checked ({checkTwo ? "checked" : "unchecked"})</Text>
                </Box>

                <Box row center gap="sm">
                  <Checkbox checked={true} disabled />
                  <Text style={{ fontSize: 14, color: colors.textMuted }}>Disabled & Checked</Text>
                </Box>

                <Box row center gap="sm">
                  <Checkbox checked={false} invalid />
                  <Text style={{ fontSize: 14, color: colors.danger }}>Invalid / Destructive Outline</Text>
                </Box>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Collapsible">
          <Card outlined>
            <Box gap="md">
              <Text color="textMuted">
                A simple accordion-like container to show/hide expandable sections with smooth animated height scaling.
              </Text>

              <Collapsible style={{ width: '100%', marginTop: 8 }}>
                <CollapsibleTrigger>
                  <Box row center style={{ justifyContent: 'space-between', paddingVertical: 4, width: '100%' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Order #4189</Text>
                    <Box center style={{ width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                      <ChevronsUpDown color={colors.textMuted} size={16} />
                    </Box>
                  </Box>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <Box gap="sm" style={{ marginTop: 12 }}>
                    {/* Box 1: Status */}
                    <Box row center style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface, justifyContent: 'space-between' }}>
                      <Text style={{ color: colors.textMuted, fontSize: 14 }}>Status</Text>
                      <Text style={{ fontWeight: '600', color: colors.text, fontSize: 14 }}>Shipped</Text>
                    </Box>

                    {/* Box 2: Shipping address */}
                    <Box style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface, gap: 2 }}>
                      <Text style={{ fontWeight: '600', color: colors.text, fontSize: 14 }}>Shipping address</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 13 }}>100 Market St, San Francisco</Text>
                    </Box>

                    {/* Box 3: Items */}
                    <Box style={{ paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface, gap: 2 }}>
                      <Text style={{ fontWeight: '600', color: colors.text, fontSize: 14 }}>Items</Text>
                      <Text style={{ color: colors.textMuted, fontSize: 13 }}>2x Studio Headphones</Text>
                    </Box>
                  </Box>
                </CollapsibleContent>
              </Collapsible>
            </Box>
          </Card>
        </Section>

        <Section title="Combobox">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                A fully floating autocomplete input selection dropdown. Tap the input to type and filter options, and tap an option to select it.
              </Text>

              <Combobox value={framework} onValueChange={setFramework}>
                <ComboboxInput placeholder="Select a framework..." />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="next" label="Next.js" />
                    <ComboboxItem value="svelte" label="SvelteKit" />
                    <ComboboxItem value="nuxt" label="Nuxt.js" />
                    <ComboboxItem value="remix" label="Remix" />
                    <ComboboxItem value="astro" label="Astro" />
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Box>
          </Card>
        </Section>

        <Section title="ContextMenu">
          <Card outlined>
            <Box gap="lg">
              <Text color="textMuted">
                Long-press the card below on mobile to reveal a floating, styled context menu with separators, labels, shortcuts, and checkbox items.
              </Text>

              <ContextMenu>
                <ContextMenuTrigger>
                  <Box center style={{ paddingVertical: 40, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, backgroundColor: colors.surfaceMuted }}>
                    <Text style={{ fontWeight: '500', color: colors.textMuted }}>
                      Long press here
                    </Text>
                  </Box>
                </ContextMenuTrigger>

                <ContextMenuContent>
                  <ContextMenuLabel>Page Actions</ContextMenuLabel>
                  <ContextMenuItem onPress={() => console.log('Back')}>
                    <Text style={{ fontSize: 14 }}>Back</Text>
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem onPress={() => console.log('Reload')}>
                    <Text style={{ fontSize: 14 }}>Reload</Text>
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <ContextMenuCheckboxItem checked={showBookmark} onCheckedChange={setShowBookmark}>
                    Show Bookmark Bar
                  </ContextMenuCheckboxItem>

                  <ContextMenuSeparator />

                  <ContextMenuItem variant="destructive" onPress={() => setAlertDialogVisible(true)}>
                    <Text style={{ fontSize: 14, color: colors.danger }}>Delete Card</Text>
                    <ContextMenuShortcut>⌫</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Box>
          </Card>
        </Section>

        <Section title="Bottom Sheet">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Gorhom bottom sheet wrapper that follows rn-ui theme tokens,
                dark/light mode, flat border styling, and themed backdrop.
              </Text>
              <Button
                leftIcon={icon(ChevronRight)}
                onPress={() => bottomSheetRef.current?.snapToIndex(0)}
              >
                Open Themed Bottom Sheet
              </Button>
            </Box>
          </Card>
        </Section>

        <Section title="Dropdown Menu">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Tap-triggered menu with flat bordered surface, alignment
                control, checkbox item, shortcuts, and modal escape hatches.
              </Text>

              <DropdownMenu>
                <DropdownMenuTrigger style={styles.dropdownTrigger}>
                  <Text variant="label" color="secondary">
                    Open Menu
                  </Text>
                  <ChevronsUpDown color={colors.secondary} size={18} />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>View Options</DropdownMenuLabel>
                  <DropdownMenuItem onPress={() => undefined}>
                    <Text style={{ fontSize: 14, color: colors.text }}>Refresh</Text>
                    <DropdownMenuShortcut>R</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onPress={() => undefined}>
                    <Text style={{ fontSize: 14, color: colors.text }}>Duplicate</Text>
                    <DropdownMenuShortcut>D</DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuCheckboxItem
                    checked={compactMenu}
                    onCheckedChange={setCompactMenu}
                  >
                    Compact mode
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onPress={() => setAlertDialogVisible(true)}
                  >
                    <Text style={{ fontSize: 14, color: colors.danger }}>Delete sample</Text>
                    <DropdownMenuShortcut>Del</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Box>
          </Card>
        </Section>

        <Section title="Empty">
          <Card>
            <Empty style={styles.emptySample}>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText color={colors.text} size={16} />
                </EmptyMedia>
                <EmptyTitle>Expo React Native</EmptyTitle>
                <EmptyDescription>
                  Expo React Native by Ma'sum. Crafted for consistent mobile UI
                  in 2026.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <Box row center gap="sm" style={styles.wrap}>
                  <Button size="sm">Explore 2026</Button>
                  <Button size="sm" variant="outline" tone="secondary">
                    by Ma'sum
                  </Button>
                </Box>

                <Button
                  size="sm"
                  variant="ghost"
                  tone="secondary"
                  rightIcon={icon(ChevronRight)}
                >
                  Expo React Native
                </Button>
              </EmptyContent>
            </Empty>
          </Card>
        </Section>

        <Section title="Hover Card">
          <Card>
            <Box gap="md">
              <Text color="textMuted">
                Long-press preview for Expo React Native by Ma'sum in 2026.
              </Text>

              <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger style={styles.hoverCardTrigger}>
                  <Text variant="label" color="primary">
                    Expo React Native
                  </Text>
                </HoverCardTrigger>
                <HoverCardContent>
                  <Box gap="xs">
                    <Text variant="label">Expo React Native</Text>
                    <Text variant="bodySmall" color="textMuted">
                      Expo React Native by Ma'sum.
                    </Text>
                    <Text variant="caption" color="textSubtle">
                      Highlight 2026
                    </Text>
                  </Box>
                </HoverCardContent>
              </HoverCard>
            </Box>
          </Card>
        </Section>

        <Section title="Input">
          <Card>
            <Box gap="md">
              <Box gap="xs">
                <Text variant="label">Expo React Native</Text>
                <Input
                  value={sampleInput}
                  onChangeText={setSampleInput}
                  placeholder="Expo React Native by Ma'sum"
                />
              </Box>

              <Box gap="xs">
                <Text variant="label">Highlight 2026</Text>
                <Input
                  type="email"
                  placeholder="expo-react-native@masum.dev"
                />
              </Box>

              <Box gap="xs">
                <Text variant="label" color="danger">
                  Invalid state
                </Text>
                <Input
                  invalid
                  value="Expo React Native by Ma'sum, 2026"
                  onChangeText={() => undefined}
                />
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Keyboard Avoiding">
          <Card>
            <KeyboardAvoiding
              fullHeight={false}
              scroll
              bg="surface"
              gap="md"
              scrollViewProps={{ scrollEnabled: false }}
            >
              <Box row center gap="md">
                <Box center bg="primarySoft" radius="lg" style={styles.sampleTile}>
                  <Smartphone color={colors.primary} size={22} />
                </Box>
                <Box flex={1}>
                  <Text variant="title">Expo React Native</Text>
                  <Text variant="bodySmall" color="textMuted">
                    Keyboard avoiding by Ma'sum for 2026 form screens.
                  </Text>
                </Box>
              </Box>

              <Input
                placeholder="Expo React Native by Ma'sum"
                returnKeyType="done"
              />
            </KeyboardAvoiding>
          </Card>
        </Section>

        <Section title="Input Group">
          <Card>
            <Box gap="md">
              <InputGroup>
                <InputGroupAddon>
                  <Search color={colors.textMuted} size={16} />
                </InputGroupAddon>
                <InputGroupInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  returnKeyType="search"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>12 results</InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              <Text variant="bodySmall" color="textMuted">
                Expo React Native by Ma'sum, 2026.
              </Text>

              <Box gap="xs">
                <Text variant="label">Input</Text>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Enter password"
                    secureTextEntry
                  />
                  <InputGroupAddon align="inline-end">
                    <EyeOff color={colors.textMuted} size={16} />
                  </InputGroupAddon>
                </InputGroup>
                <Text variant="bodySmall" color="textMuted">
                  Icon positioned at the end.
                </Text>
              </Box>

              <Box gap="xs">
                <Text variant="label">Input</Text>
                <InputGroup orientation="block">
                  <InputGroupAddon align="block-start">
                    <InputGroupText>Full Name</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput placeholder="Enter your name" />
                </InputGroup>
                <Text variant="bodySmall" color="textMuted">
                  Header positioned above the input.
                </Text>
              </Box>

              <Box gap="xs">
                <Text variant="label">Textarea</Text>
                <InputGroup orientation="block">
                  <InputGroupAddon align="block-start" style={styles.inputGroupRowAddon}>
                    <Box row center gap="sm" flex={1}>
                      <FileCode color={colors.textMuted} size={16} />
                      <InputGroupText>script.js</InputGroupText>
                    </Box>
                    <Copy color={colors.textMuted} size={16} />
                  </InputGroupAddon>
                  <InputGroupTextarea
                    value={"console.log('Hello, world!');"}
                    onChangeText={() => undefined}
                  />
                </InputGroup>
                <Text variant="bodySmall" color="textMuted">
                  Header positioned above the textarea.
                </Text>
              </Box>

              <Box gap="xs">
                <Text variant="label">Input</Text>
                <InputGroup orientation="block">
                  <InputGroupInput placeholder="Enter amount" />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <Text variant="bodySmall" color="textMuted">
                  Footer positioned below the input.
                </Text>
              </Box>

              <Box gap="xs">
                <Text variant="label">Textarea</Text>
                <InputGroup orientation="block">
                  <InputGroupTextarea placeholder="Write a comment..." />
                  <InputGroupAddon align="block-end" style={styles.inputGroupRowAddon}>
                    <InputGroupText>0/280</InputGroupText>
                    <InputGroupButton size="sm" variant="filled">
                      Post
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <Text variant="bodySmall" color="textMuted">
                  Footer positioned below the textarea.
                </Text>
              </Box>
            </Box>
          </Card>
        </Section>

        <Section title="Input OTP">
          <Card>
            <Box gap="md">
              <Box gap="xs">
                <Text variant="label">Expo React Native OTP</Text>
                <Text variant="bodySmall" color="textMuted">
                  One-time code input by Ma'sum, 2026.
                </Text>
              </Box>

              <InputOTP
                value={otpValue}
                onChangeText={setOtpValue}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <InputOTP maxLength={4} invalid>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </Box>
          </Card>
        </Section>

        <Section title="Item">
          <Card>
            <ItemGroup>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <Inbox color={colors.primary} size={20} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Expo React Native</ItemTitle>
                  <ItemDescription>
                    Reusable item row by Ma'sum for consistent 2026 mobile lists.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge tone="success" variant="soft">Active</Badge>
                </ItemActions>
              </Item>

              <ItemSeparator />

              <Item variant="muted" size="sm">
                <ItemHeader>
                  <ItemTitle>Theme tokens</ItemTitle>
                  <Badge tone="info" variant="outline">2026</Badge>
                </ItemHeader>
                <ItemContent>
                  <ItemDescription>
                    Header and footer areas stay full width while content remains
                    composable.
                  </ItemDescription>
                </ItemContent>
                <ItemFooter>
                  <Text variant="caption" color="textMuted">by Ma'sum</Text>
                  <Button size="xs" variant="ghost" tone="secondary">
                    View
                  </Button>
                </ItemFooter>
              </Item>
            </ItemGroup>
          </Card>
        </Section>
      </KeyboardAvoiding>

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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={bottomSheetSnapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Box gap="md">
            <Box row center gap="md">
              <Box center bg="primarySoft" radius="lg" style={styles.sampleTile}>
                <Palette color={colors.primary} size={22} />
              </Box>
              <Box flex={1}>
                <Text variant="title">Theme-aware sheet</Text>
                <Text variant="bodySmall" color="textMuted">
                  Background, handle, border, and backdrop are mapped from
                  rn-ui tokens.
                </Text>
              </Box>
            </Box>

            <Divider />

            <Box row gap="sm">
              <Badge tone="primary">Flat</Badge>
              <Badge tone="success">Dark ready</Badge>
              <Badge tone="info">Gorhom</Badge>
            </Box>

            <Button
              variant="outline"
              tone="secondary"
              onPress={() => bottomSheetRef.current?.close()}
            >
              Close
            </Button>
          </Box>
        </BottomSheetView>
      </BottomSheet>
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
    bottomSheetContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
      minHeight: 320,
    },
    dropdownTrigger: {
      minHeight: theme.components.button.height.md,
      paddingHorizontal: theme.components.button.paddingX.md,
      borderRadius: theme.radii.lg,
      borderWidth: 1.25,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    emptySample: {
      minHeight: 280,
    },
    hoverCardTrigger: {
      minHeight: theme.components.button.height.md,
      paddingHorizontal: theme.components.button.paddingX.md,
      borderRadius: theme.radii.lg,
      borderWidth: 1.25,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    },
    inputGroupRowAddon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
    },
  }));
}
