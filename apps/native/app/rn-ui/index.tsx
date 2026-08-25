import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import {
  Badge,
  Box,
  Card,
  Input,
  Text,
  useTheme,
  useThemeStyles,
  type ComponentTone,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../../components/system-ui-overlay";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useHeaderScroll } from "../../components/useHeaderScroll";

export interface ComponentCatalogItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  tone?: ComponentTone;
}

export interface ComponentCategory {
  title: string;
  description: string;
  iconName: string;
  items: ComponentCatalogItem[];
}

export const CATALOG_CATEGORIES: ComponentCategory[] = [
  {
    title: "Layout Primitives",
    description:
      "Structural layout blocks with zero elevation and flat border options.",
    iconName: "Layers",
    items: [
      {
        id: "box",
        name: "Box",
        description: "Flexbox container with spacing and background tokens.",
        tone: "primary",
      },
      {
        id: "card",
        name: "Card",
        description: "Elevated, padded, or outlined content container.",
        tone: "primary",
      },
      {
        id: "divider",
        name: "Divider",
        description: "Flat separator line for flex layouts.",
        tone: "primary",
      },
      {
        id: "aspect-ratio",
        name: "AspectRatio",
        description: "Maintains fixed proportion ratio for media & views.",
        tone: "primary",
      },
      {
        id: "keyboard-avoiding",
        name: "KeyboardAvoiding",
        description: "Responsive keyboard avoiding wrapper.",
        tone: "primary",
      },
    ],
  },
  {
    title: "Typography & Content",
    description:
      "Typography hierarchy, chat bubbles, list items, and empty states.",
    iconName: "Type",
    items: [
      {
        id: "text",
        name: "Text",
        description:
          "Theme-driven typography with display, headings, and labels.",
        tone: "secondary",
      },
      {
        id: "item",
        name: "Item",
        description: "Flexible list item row with left/right slots.",
        tone: "secondary",
      },
      {
        id: "bubble",
        name: "Bubble",
        description: "Chat message bubble with sent/received styling.",
        tone: "secondary",
      },
      {
        id: "attachment",
        name: "Attachment",
        description: "File attachment card with progress indicator.",
        tone: "secondary",
      },
      {
        id: "data-list",
        name: "DataList",
        description: "Key-value pair data list display.",
        tone: "secondary",
      },
      {
        id: "metric-card",
        name: "MetricCard",
        description: "KPI metric card with trend indicators.",
        tone: "secondary",
      },
      {
        id: "table",
        name: "Table",
        description: "Structured data table with header and cell styling.",
        tone: "secondary",
      },
      {
        id: "timeline",
        name: "Timeline",
        description: "Vertical event timeline with status nodes.",
        tone: "secondary",
      },
      {
        id: "empty",
        name: "Empty",
        description: "Empty state placeholder with action button.",
        tone: "secondary",
      },
    ],
  },
  {
    title: "Buttons & Action Controls",
    description: "Interactive buttons, icon buttons, button groups, and FABs.",
    iconName: "Sparkles",
    items: [
      {
        id: "button",
        name: "Button",
        description: "Interactive pressable button with variants and tones.",
        tone: "accent",
      },
      {
        id: "icon-button",
        name: "IconButton",
        description: "Square or rounded icon action button.",
        tone: "accent",
      },
      {
        id: "button-group",
        name: "ButtonGroup",
        description: "Grouped segment buttons with continuous borders.",
        tone: "accent",
      },
      {
        id: "floating-action-button",
        name: "FloatingActionButton",
        description: "Elevated primary action button.",
        tone: "accent",
      },
      {
        id: "badge",
        name: "Badge",
        description: "Status badge pill with semantic color intents.",
        tone: "accent",
      },
    ],
  },
  {
    title: "Form & Selection Inputs",
    description:
      "Form inputs, textareas, sliders, switches, ratings, and pickers.",
    iconName: "Sliders",
    items: [
      {
        id: "input",
        name: "Input",
        description: "Theme-aware text input field.",
        tone: "success",
      },
      {
        id: "input-group",
        name: "InputGroup",
        description: "Input container with prefix and suffix addons.",
        tone: "success",
      },
      {
        id: "input-otp",
        name: "InputOTP",
        description: "One-time password PIN verification input.",
        tone: "success",
      },
      {
        id: "textarea",
        name: "Textarea",
        description: "Multiline text entry input.",
        tone: "success",
      },
      {
        id: "checkbox",
        name: "Checkbox",
        description: "Selection checkbox with custom icons.",
        tone: "success",
      },
      {
        id: "radio-group",
        name: "RadioGroup",
        description: "Single-choice radio button group.",
        tone: "success",
      },
      {
        id: "switch",
        name: "Switch",
        description: "Toggle switch with smooth Reanimated motion.",
        tone: "success",
      },
      {
        id: "slider",
        name: "Slider",
        description: "Range slider with gesture handler thumb.",
        tone: "success",
      },
      {
        id: "rating",
        name: "Rating",
        description: "Star rating control with fractional feedback.",
        tone: "success",
      },
      {
        id: "select",
        name: "Select",
        description: "Dropdown selector modal with options list.",
        tone: "success",
      },
      {
        id: "combobox",
        name: "Combobox",
        description: "Searchable auto-complete dropdown select.",
        tone: "success",
      },
      {
        id: "form-field",
        name: "FormField",
        description:
          "Form input wrapper with label and validation error message.",
        tone: "success",
      },
    ],
  },
  {
    title: "Navigation & Indicators",
    description:
      "Tab navigation, breadcrumbs, pagination, and multi-step steppers.",
    iconName: "Layers",
    items: [
      {
        id: "tabs",
        name: "Tabs",
        description: "Tabbed view navigator with animated indicator.",
        tone: "warning",
      },
      {
        id: "breadcrumb",
        name: "Breadcrumb",
        description: "Navigation path breadcrumb trail.",
        tone: "warning",
      },
      {
        id: "pagination",
        name: "Pagination",
        description: "Page number navigation controls.",
        tone: "warning",
      },
      {
        id: "stepper",
        name: "Stepper",
        description: "Multi-step progress indicator.",
        tone: "warning",
      },
    ],
  },
  {
    title: "Overlays & Feedback",
    description:
      "Alerts, sheets, popovers, dropdown menus, context menus, and toasts.",
    iconName: "Sparkles",
    items: [
      {
        id: "alert",
        name: "Alert",
        description: "Inline alert banner with icon and action.",
        tone: "danger",
      },
      {
        id: "alert-dialog",
        name: "AlertDialog",
        description: "Confirmation modal dialog with backdrop blur.",
        tone: "danger",
      },
      {
        id: "sheet",
        name: "Sheet",
        description: "Custom bottom sheet modal overlay.",
        tone: "danger",
      },
      {
        id: "bottom-sheet",
        name: "BottomSheet",
        description: "Gorhom-powered gesture bottom sheet.",
        tone: "danger",
      },
      {
        id: "popover",
        name: "Popover",
        description: "Anchored popover menu card.",
        tone: "danger",
      },
      {
        id: "hover-card",
        name: "HoverCard",
        description: "Preview card trigger on interaction.",
        tone: "danger",
      },
      {
        id: "dropdown-menu",
        name: "DropdownMenu",
        description: "Contextual dropdown actions menu.",
        tone: "danger",
      },
      {
        id: "context-menu",
        name: "ContextMenu",
        description: "Long-press context menu popup.",
        tone: "danger",
      },
      {
        id: "command",
        name: "Command",
        description: "Command palette modal with fuzzy search.",
        tone: "danger",
      },
      {
        id: "toast",
        name: "Toast",
        description: "Imperative toast notification provider.",
        tone: "danger",
      },
    ],
  },
  {
    title: "Disclosure & Accordions",
    description: "Collapsible panels, accordions, and touch carousels.",
    iconName: "Layers",
    items: [
      {
        id: "accordion",
        name: "Accordion",
        description: "Expandable flat accordion sections.",
        tone: "info",
      },
      {
        id: "collapsible",
        name: "Collapsible",
        description: "Toggleable expandable panel container.",
        tone: "info",
      },
      {
        id: "carousel",
        name: "Carousel",
        description: "Touch horizontal carousel slider.",
        tone: "info",
      },
    ],
  },
  {
    title: "Data & Pickers",
    description: "Calendar date pickers, progress bars, skeletons, and avatars.",
    iconName: "Sliders",
    items: [
      {
        id: "calendar",
        name: "Calendar",
        description:
          "Full Quranic/Gregorian calendar picker with fast month selection.",
        tone: "primary",
      },
      {
        id: "progress",
        name: "Progress",
        description: "Animated progress bar indicator.",
        tone: "primary",
      },
      {
        id: "skeleton",
        name: "Skeleton",
        description: "Content loading placeholder animation.",
        tone: "primary",
      },
      {
        id: "avatar",
        name: "Avatar",
        description:
          "User avatar with fallback initials and group stack.",
        tone: "primary",
      },
    ],
  },
];

export default function RnUiCatalogScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { onScroll, headerStyle, scrollEventThrottle } = useHeaderScroll({
    headerHeight: 170,
  });

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return CATALOG_CATEGORIES;
    const q = searchQuery.toLowerCase();

    return CATALOG_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  const totalComponents = React.useMemo(
    () => CATALOG_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0),
    [],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <SystemUIOverlay />

      <ScreenHeader
        showBack
        eyebrow="@masumdev/rn-ui"
        title="RN UI Catalog"
        subtitle={`Select any component from ${totalComponents} UI primitives.`}
        headerStyle={headerStyle}
      />

      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 95,
            paddingBottom: insets.bottom + spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <Input
          placeholder={`Search ${totalComponents} components...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Categories Grid */}
        <Box gap="xxl">
          {filteredCategories.map((category) => (
            <Box key={category.title} gap="md">
              {/* Category Header */}
              <Box
                row
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: spacing.xs,
                  marginTop: spacing.xs,
                }}
              >
                <Box flex={1} style={{ paddingRight: spacing.sm }} gap="xs">
                  <Text variant="h3">{category.title}</Text>
                  <Text variant="caption" color="textMuted">
                    {category.description}
                  </Text>
                </Box>
                <Badge tone="secondary" variant="outline">
                  {`${category.items.length} items`}
                </Badge>
              </Box>

              {/* Items Grid */}
              <Box style={styles.grid}>
                {category.items.map((item) => {
                  const toneColor =
                    item.tone === "danger"
                      ? colors.danger
                      : item.tone === "warning"
                        ? colors.warning
                        : item.tone === "success"
                          ? colors.success
                          : item.tone === "accent"
                            ? colors.accent
                            : item.tone === "secondary"
                              ? colors.secondary
                              : colors.primary;

                  return (
                    <Card
                      key={item.id}
                      style={styles.cardWrapper}
                    >
                      <Pressable
                        onPress={() => router.push(`/rn-ui/${item.id}` as never)}
                        style={styles.cardPressable}
                      >
                        <Box row style={{ alignItems: "center" }} gap="sm">
                          <Box flex={1} gap="xs">
                            <Box row style={{ alignItems: "center" }} gap="xs">
                              <Text variant="h3" style={{ fontSize: 16, includeFontPadding: false }}>
                                {item.name}
                              </Text>
                              <Badge tone={item.tone || "secondary"} size="sm" style={{ alignSelf: "center" }}>
                                {item.id}
                              </Badge>
                            </Box>
                            <Text
                              variant="caption"
                              color="textMuted"
                              numberOfLines={2}
                              style={{ lineHeight: 18 }}
                            >
                              {item.description}
                            </Text>
                          </Box>
                          <ChevronRight color={toneColor} size={18} />
                        </Box>
                      </Pressable>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
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
      paddingHorizontal: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      gap: theme.spacing.xl,
    },
    grid: {
      gap: theme.spacing.md,
    },
    cardWrapper: {
      padding: 0,
      overflow: "hidden",
    },
    cardPressable: {
      padding: theme.spacing.md,
    },
  }));
}
