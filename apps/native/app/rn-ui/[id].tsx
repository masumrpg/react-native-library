import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Box,
  IconButton,
  Text,
  useTheme,
  useThemeStyles,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../../components/system-ui-overlay";
import { useSectionContext } from "../../components/rn-ui/useSectionContext";
import {
  AccordionSection,
  AlertDialogSection,
  AlertSection,
  AspectRatioSection,
  AttachmentsSection,
  AvatarSection,
  BadgesSection,
  BottomSheetSection,
  BoxSection,
  CardSection,
  DividerSection,
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
  FloatingActionButtonSection,
  FormSection,
  HoverCardSection,
  IconButtonsSection,
  InputGroupSection,
  InputOTPSection,
  InputSection,
  ItemSection,
  KeyboardAvoidingSection,
  RatingSection,
  SwitchSection,
  RadioGroupSection,
  SliderSection,
  ProgressSection,
  SkeletonSection,
  TabsSection,
  StepperSection,
  SheetSection,
  TextareaSection,
  SelectSection,
  CommandSection,
  PopoverSection,
  PaginationSection,
  BreadcrumbSection,
  TableSection,
  DataListSection,
  TimelineSection,
  MetricCardSection,
  TextSection,
  ToastSection,
} from "../../components/rn-ui";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

export default function RnUiComponentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const ctx = useSectionContext();

  const renderComponentShowcase = () => {
    switch (id) {
      // Layout Primitives
      case "box":
        return <BoxSection ctx={ctx} />;
      case "card":
        return <CardSection ctx={ctx} />;
      case "divider":
        return <DividerSection ctx={ctx} />;
      case "aspect-ratio":
        return <AspectRatioSection ctx={ctx} />;
      case "keyboard-avoiding":
        return <KeyboardAvoidingSection ctx={ctx} />;

      // Typography & Content
      case "text":
        return <TextSection ctx={ctx} />;
      case "item":
        return <ItemSection ctx={ctx} />;
      case "bubble":
        return <ChatBubblesSection ctx={ctx} />;
      case "attachment":
        return <AttachmentsSection ctx={ctx} />;
      case "data-list":
        return <DataListSection ctx={ctx} />;
      case "metric-card":
        return <MetricCardSection ctx={ctx} />;
      case "table":
        return <TableSection ctx={ctx} />;
      case "timeline":
        return <TimelineSection ctx={ctx} />;
      case "empty":
        return <EmptySection ctx={ctx} />;

      // Buttons & Action Controls
      case "button":
        return <ButtonsSection ctx={ctx} />;
      case "icon-button":
        return <IconButtonsSection ctx={ctx} />;
      case "button-group":
        return <ButtonGroupsSection ctx={ctx} />;
      case "floating-action-button":
        return <FloatingActionButtonSection ctx={ctx} />;
      case "badge":
        return <BadgesSection ctx={ctx} />;

      // Form & Selection Inputs
      case "input":
        return <InputSection ctx={ctx} />;
      case "input-group":
        return <InputGroupSection ctx={ctx} />;
      case "input-otp":
        return <InputOTPSection ctx={ctx} />;
      case "textarea":
        return <TextareaSection ctx={ctx} />;
      case "checkbox":
        return <CheckboxSection ctx={ctx} />;
      case "radio-group":
        return <RadioGroupSection ctx={ctx} />;
      case "switch":
        return <SwitchSection ctx={ctx} />;
      case "slider":
        return <SliderSection ctx={ctx} />;
      case "rating":
        return <RatingSection ctx={ctx} />;
      case "select":
        return <SelectSection ctx={ctx} />;
      case "combobox":
        return <ComboboxSection ctx={ctx} />;
      case "form-field":
        return <FormSection ctx={ctx} />;

      // Navigation & Indicators
      case "tabs":
        return <TabsSection ctx={ctx} />;
      case "breadcrumb":
        return <BreadcrumbSection ctx={ctx} />;
      case "pagination":
        return <PaginationSection ctx={ctx} />;
      case "stepper":
        return <StepperSection ctx={ctx} />;

      // Overlays & Feedback
      case "alert":
        return <AlertSection ctx={ctx} />;
      case "alert-dialog":
        return <AlertDialogSection ctx={ctx} />;
      case "sheet":
        return <SheetSection ctx={ctx} />;
      case "bottom-sheet":
        return <BottomSheetSection ctx={ctx} />;
      case "popover":
        return <PopoverSection ctx={ctx} />;
      case "hover-card":
        return <HoverCardSection ctx={ctx} />;
      case "dropdown-menu":
        return <DropdownMenuSection ctx={ctx} />;
      case "context-menu":
        return <ContextMenuSection ctx={ctx} />;
      case "command":
        return <CommandSection ctx={ctx} />;
      case "toast":
        return <ToastSection ctx={ctx} />;

      // Disclosure & Accordions
      case "accordion":
        return <AccordionSection ctx={ctx} />;
      case "collapsible":
        return <CollapsibleSection ctx={ctx} />;
      case "carousel":
        return <CarouselSection ctx={ctx} />;

      // Data & Pickers
      case "calendar":
        return <CalendarSection ctx={ctx} />;
      case "progress":
        return <ProgressSection ctx={ctx} />;
      case "skeleton":
        return <SkeletonSection ctx={ctx} />;
      case "avatar":
        return <AvatarSection ctx={ctx} />;

      default:
        return <ButtonsSection ctx={ctx} />;
    }
  };

  const formattedTitle = (id || "Component")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header matching exact layout screenshot */}
        <Box row center gap="md">
          <IconButton
            icon={icon(ChevronLeft)}
            variant="outline"
            onPress={() => router.back()}
          />
          <Box flex={1}>
            <Text variant="labelSmall" color="primary">
              {`@masumdev/rn-ui/${id || "component"}`}
            </Text>
            <Text variant="h2">{formattedTitle}</Text>
          </Box>
        </Box>

        {/* Component Showcase Body */}
        {renderComponentShowcase()}
      </ScrollView>
    </View>
  );
}

function useStyles() {
  return useThemeStyles((theme) => ({
    safeArea: {
      flex: 1,
    },
    container: {
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
    },
  }));
}
