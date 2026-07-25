import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Card,
  Command,
  Divider,
  IconButton,
  KeyboardAvoiding,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Text,
  useTheme,
  useThemeStyles,
  useToast,
  type BottomSheetMethods,
  type ColorSchemePreference,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  Moon,
  Palette,
  Settings,
  Smartphone,
  Sun,
  Trash,
  X,
} from "lucide-react-native";
import React from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AccordionSection,
  AlertDialogSection,
  AlertSection,
  AspectRatioSection,
  AttachmentsSection,
  AvatarSection,
  BadgesSection,
  BottomSheetSection,
  BoxCardDividerSection,
  ButtonGroupsSection,
  ButtonsSection,
  CalendarSection,
  CarouselSection,
  ChatBubblesSection,
  CheckboxSection,
  CollapsibleSection,
  ComboboxSection,
  ContextMenuSection,
  DropdownMenuSection,
  EmptySection,
  FormSection,
  HoverCardSection,
  IconButtonsSection,
  InputGroupSection,
  InputOTPSection,
  InputSection,
  ItemSection,
  KeyboardAvoidingSection,
  PopoverPaginationBreadcrumbSection,
  ProgressSkeletonSection,
  SwitchRadioSliderSection,
  TableDataListSection,
  TabsStepperSheetSection,
  TextareaSelectCommandSection,
  TextSection,
  ThemeProviderSection,
  TimelineMetricCardSection,
  ToastSection,
} from "../components/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

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
  const toast = useToast();
  const [showAlertDetails, setShowAlertDetails] = React.useState(false);
  const [alertDialogVisible, setAlertDialogVisible] = React.useState(false);
  const [activeSegment, setActiveSegment] = React.useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");
  const [containerWidth, setContainerWidth] = React.useState(0);
  const slideAnim = React.useRef(new Animated.Value(1)).current;
  const [selectedDate, setSelectedDate] = React.useState("2026-07-15");
  const [rangeStart, setRangeStart] = React.useState<string | null>(
    "2026-07-08",
  );
  const [rangeEnd, setRangeEnd] = React.useState<string | null>("2026-07-11");
  const [checkOne, setCheckOne] = React.useState(false);
  const [checkTwo, setCheckTwo] = React.useState(true);
  const [framework, setFramework] = React.useState("");
  const [sampleInput, setSampleInput] = React.useState(
    "Expo React Native by Ma'sum",
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [otpValue, setOtpValue] = React.useState("2026");
  const [switchEnabled, setSwitchEnabled] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState("expo");
  const [sliderValue, setSliderValue] = React.useState(64);
  const [stepperValue, setStepperValue] = React.useState(2);
  const [tabValue, setTabValue] = React.useState("preview");
  const [selectValue, setSelectValue] = React.useState("expo");
  const [commandVisible, setCommandVisible] = React.useState(false);
  const [page, setPage] = React.useState(1);
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
    const toValue =
      activeSegment === "weekly" ? 0 : activeSegment === "monthly" ? 1 : 2;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
  }, [activeSegment, slideAnim]);

  const padding = 3;
  const borderWidth = 2.5; // Double of 1.25 border width
  const innerWidth = containerWidth - padding * 2 - borderWidth;
  const activeBlockWidth = innerWidth / 3;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, activeBlockWidth, activeBlockWidth * 2],
  });

  const ctx = {
    colors,
    radii,
    styles,
    icon,
    themeOptions,
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
    toggleColorScheme,
    showAlertDetails,
    setShowAlertDetails,
    setAlertDialogVisible,
    activeSegment,
    setActiveSegment,
    containerWidth,
    setContainerWidth,
    padding,
    activeBlockWidth,
    translateX,
    selectedDate,
    setSelectedDate,
    rangeStart,
    rangeEnd,
    handleRangePress,
    getRangeMarkedDates,
    checkOne,
    setCheckOne,
    checkTwo,
    setCheckTwo,
    framework,
    setFramework,
    sampleInput,
    setSampleInput,
    searchQuery,
    setSearchQuery,
    otpValue,
    setOtpValue,
    switchEnabled,
    setSwitchEnabled,
    radioValue,
    setRadioValue,
    sliderValue,
    setSliderValue,
    stepperValue,
    setStepperValue,
    tabValue,
    setTabValue,
    selectValue,
    setSelectValue,
    setCommandVisible,
    page,
    setPage,
    showBookmark,
    setShowBookmark,
    compactMenu,
    setCompactMenu,
    bottomSheetRef,
    toast,
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
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

        <ThemeProviderSection ctx={ctx} />

        <TextSection ctx={ctx} />

        <ButtonsSection ctx={ctx} />

        <IconButtonsSection ctx={ctx} />

        <BadgesSection ctx={ctx} />

        <AlertSection ctx={ctx} />

        <AlertDialogSection ctx={ctx} />

        <AccordionSection ctx={ctx} />

        <BoxCardDividerSection ctx={ctx} />

        <AspectRatioSection ctx={ctx} />

        <AttachmentsSection ctx={ctx} />

        <AvatarSection ctx={ctx} />

        <ChatBubblesSection ctx={ctx} />

        <ButtonGroupsSection ctx={ctx} />

        <CalendarSection ctx={ctx} />

        <CarouselSection ctx={ctx} />

        <CheckboxSection ctx={ctx} />

        <CollapsibleSection ctx={ctx} />

        <ComboboxSection ctx={ctx} />

        <ContextMenuSection ctx={ctx} />

        <BottomSheetSection ctx={ctx} />

        <DropdownMenuSection ctx={ctx} />

        <EmptySection ctx={ctx} />

        <HoverCardSection ctx={ctx} />

        <InputSection ctx={ctx} />

        <KeyboardAvoidingSection ctx={ctx} />

        <InputGroupSection ctx={ctx} />

        <InputOTPSection ctx={ctx} />

        <ItemSection ctx={ctx} />

        <ToastSection ctx={ctx} />

        <FormSection ctx={ctx} />

        <SwitchRadioSliderSection ctx={ctx} />

        <ProgressSkeletonSection ctx={ctx} />

        <TabsStepperSheetSection ctx={ctx} />

        <TextareaSelectCommandSection ctx={ctx} />

        <PopoverPaginationBreadcrumbSection ctx={ctx} />

        <TableDataListSection ctx={ctx} />

        <TimelineMetricCardSection ctx={ctx} />
      </KeyboardAvoiding>

      <Command
        visible={commandVisible}
        onClose={() => setCommandVisible(false)}
        title="Expo React Native Command"
        items={[
          {
            value: "theme",
            label: "Theme tokens",
            description: "Colors, radius, typography.",
            icon: icon(Palette),
          },
          {
            value: "form",
            label: "Form controls",
            description: "Input, Select, Textarea.",
            icon: icon(Settings),
          },
          {
            value: "toast",
            label: "Toast",
            description: "Programmatic feedback.",
            icon: icon(CircleAlert),
          },
        ]}
        onSelect={(value) =>
          toast.show({
            title: "Expo React Native",
            description: `Selected ${value} by Ma'sum.`,
            tone: "info",
          })
        }
      />

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

      <Sheet ref={bottomSheetRef} index={-1} snapPoints={bottomSheetSnapPoints}>
        <SheetContent style={styles.bottomSheetContent}>
          <Box gap="md">
            <SheetHeader>
              <SheetTitle>Expo React Native Sheet</SheetTitle>
              <SheetDescription>
                Higher-level sheet wrapper by Ma'sum using Gorhom BottomSheet
                tokens.
              </SheetDescription>
            </SheetHeader>

            <Divider />

            <Box row gap="sm">
              <Badge tone="primary">Flat</Badge>
              <Badge tone="success">Dark ready</Badge>
              <Badge tone="info">Gorhom</Badge>
            </Box>

            <SheetFooter>
              <Button
                variant="outline"
                tone="secondary"
                onPress={() => bottomSheetRef.current?.close()}
              >
                Close
              </Button>
            </SheetFooter>
          </Box>
        </SheetContent>
      </Sheet>
    </SafeAreaView>
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
    popoverTrigger: {
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
