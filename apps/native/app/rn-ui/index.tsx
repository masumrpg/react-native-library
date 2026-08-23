import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Moon,
  Search,
  Sliders,
  Sparkles,
  Sun,
  Type,
} from "lucide-react-native";
import {
  Badge,
  Box,
  Button,
  Card,
  IconButton,
  Input,
  Text,
  useTheme,
  useThemeStyles,
  type ComponentTone,
  type RenderIcon,
} from "@masumdev/rn-ui";
import { SystemUIOverlay } from "../../components/system-ui-overlay";

const icon =
  (Icon: React.ComponentType<{ color?: string; size?: number }>): RenderIcon =>
  ({ color, size }) => <Icon color={color} size={size} />;

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
    description: "Structural layout blocks with zero elevation and flat border options.",
    iconName: "Layers",
    items: [
      { id: "box", name: "Box", description: "Flexbox container with spacing and background tokens.", tone: "primary" },
      { id: "card", name: "Card", description: "Elevated, padded, or outlined content container.", tone: "primary" },
      { id: "divider", name: "Divider", description: "Flat separator line for flex layouts.", tone: "primary" },
      { id: "aspect-ratio", name: "AspectRatio", description: "Maintains fixed proportion ratio for media & views.", tone: "primary" },
      { id: "keyboard-avoiding", name: "KeyboardAvoiding", description: "Responsive keyboard avoiding wrapper.", tone: "primary" },
    ],
  },
  {
    title: "Typography & Content",
    description: "Typography hierarchy, chat bubbles, list items, and empty states.",
    iconName: "Type",
    items: [
      { id: "text", name: "Text", description: "Theme-driven typography with display, headings, and labels.", tone: "secondary" },
      { id: "item", name: "Item", description: "Flexible list item row with left/right slots.", tone: "secondary" },
      { id: "bubble", name: "Bubble", description: "Chat message bubble with sent/received styling.", tone: "secondary" },
      { id: "attachment", name: "Attachment", description: "File attachment card with progress indicator.", tone: "secondary" },
      { id: "data-list", name: "DataList", description: "Key-value pair data list display.", tone: "secondary" },
      { id: "metric-card", name: "MetricCard", description: "KPI metric card with trend indicators.", tone: "secondary" },
      { id: "table", name: "Table", description: "Structured data table with header and cell styling.", tone: "secondary" },
      { id: "timeline", name: "Timeline", description: "Vertical event timeline with status nodes.", tone: "secondary" },
      { id: "empty", name: "Empty", description: "Empty state placeholder with action button.", tone: "secondary" },
    ],
  },
  {
    title: "Buttons & Action Controls",
    description: "Interactive buttons, icon buttons, button groups, and FABs.",
    iconName: "Sparkles",
    items: [
      { id: "button", name: "Button", description: "Interactive pressable button with variants and tones.", tone: "accent" },
      { id: "icon-button", name: "IconButton", description: "Square or rounded icon action button.", tone: "accent" },
      { id: "button-group", name: "ButtonGroup", description: "Grouped segment buttons with continuous borders.", tone: "accent" },
      { id: "floating-action-button", name: "FloatingActionButton", description: "Elevated primary action button.", tone: "accent" },
      { id: "badge", name: "Badge", description: "Status badge pill with semantic color intents.", tone: "accent" },
    ],
  },
  {
    title: "Form & Selection Inputs",
    description: "Form inputs, textareas, sliders, switches, ratings, and pickers.",
    iconName: "Sliders",
    items: [
      { id: "input", name: "Input", description: "Theme-aware text input field.", tone: "success" },
      { id: "input-group", name: "InputGroup", description: "Input container with prefix and suffix addons.", tone: "success" },
      { id: "input-otp", name: "InputOTP", description: "One-time password PIN verification input.", tone: "success" },
      { id: "textarea", name: "Textarea", description: "Multiline text entry input.", tone: "success" },
      { id: "checkbox", name: "Checkbox", description: "Selection checkbox with custom icons.", tone: "success" },
      { id: "radio-group", name: "RadioGroup", description: "Single-choice radio button group.", tone: "success" },
      { id: "switch", name: "Switch", description: "Toggle switch with smooth Reanimated motion.", tone: "success" },
      { id: "slider", name: "Slider", description: "Range slider with gesture handler thumb.", tone: "success" },
      { id: "rating", name: "Rating", description: "Star rating control with fractional feedback.", tone: "success" },
      { id: "select", name: "Select", description: "Dropdown selector modal with options list.", tone: "success" },
      { id: "combobox", name: "Combobox", description: "Searchable auto-complete dropdown select.", tone: "success" },
      { id: "form-field", name: "FormField", description: "Form input wrapper with label and validation error message.", tone: "success" },
    ],
  },
  {
    title: "Navigation & Indicators",
    description: "Tab navigation, breadcrumbs, pagination, and multi-step steppers.",
    iconName: "Layers",
    items: [
      { id: "tabs", name: "Tabs", description: "Tabbed view navigator with animated indicator.", tone: "warning" },
      { id: "breadcrumb", name: "Breadcrumb", description: "Navigation path breadcrumb trail.", tone: "warning" },
      { id: "pagination", name: "Pagination", description: "Page number navigation controls.", tone: "warning" },
      { id: "stepper", name: "Stepper", description: "Multi-step progress indicator.", tone: "warning" },
    ],
  },
  {
    title: "Overlays & Feedback",
    description: "Alerts, sheets, popovers, dropdown menus, context menus, and toasts.",
    iconName: "Sparkles",
    items: [
      { id: "alert", name: "Alert", description: "Inline alert banner with icon and action.", tone: "danger" },
      { id: "alert-dialog", name: "AlertDialog", description: "Confirmation modal dialog with backdrop blur.", tone: "danger" },
      { id: "sheet", name: "Sheet", description: "Custom bottom sheet modal overlay.", tone: "danger" },
      { id: "bottom-sheet", name: "BottomSheet", description: "Gorhom-powered gesture bottom sheet.", tone: "danger" },
      { id: "popover", name: "Popover", description: "Anchored popover menu card.", tone: "danger" },
      { id: "hover-card", name: "HoverCard", description: "Preview card trigger on interaction.", tone: "danger" },
      { id: "dropdown-menu", name: "DropdownMenu", description: "Contextual dropdown actions menu.", tone: "danger" },
      { id: "context-menu", name: "ContextMenu", description: "Long-press context menu popup.", tone: "danger" },
      { id: "command", name: "Command", description: "Command palette modal with fuzzy search.", tone: "danger" },
      { id: "toast", name: "Toast", description: "Imperative toast notification provider.", tone: "danger" },
    ],
  },
  {
    title: "Disclosure & Accordions",
    description: "Collapsible panels, accordions, and touch carousels.",
    iconName: "Layers",
    items: [
      { id: "accordion", name: "Accordion", description: "Expandable flat accordion sections.", tone: "info" },
      { id: "collapsible", name: "Collapsible", description: "Toggleable expandable panel container.", tone: "info" },
      { id: "carousel", name: "Carousel", description: "Touch horizontal carousel slider.", tone: "info" },
    ],
  },
  {
    title: "Data & Pickers",
    description: "Calendar date pickers, progress bars, skeletons, and avatars.",
    iconName: "Sliders",
    items: [
      { id: "calendar", name: "Calendar", description: "Full Quranic/Gregorian calendar picker with fast month selection.", tone: "primary" },
      { id: "progress", name: "Progress", description: "Animated progress bar indicator.", tone: "primary" },
      { id: "skeleton", name: "Skeleton", description: "Content loading placeholder animation.", tone: "primary" },
      { id: "avatar", name: "Avatar", description: "User avatar with fallback initials and group stack.", tone: "primary" },
    ],
  },
];

export default function RnUiCatalogScreen() {
  const router = useRouter();
  const { colors, isDark, setColorScheme, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return CATALOG_CATEGORIES;
    const q = searchQuery.toLowerCase();

    return CATALOG_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  const totalComponents = React.useMemo(
    () => CATALOG_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0),
    []
  );

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
              @masumdev/rn-ui
            </Text>
            <Text variant="h2">RN UI Catalog</Text>
          </Box>
        </Box>

        <Text color="textMuted">
          Select any component to view its interactive showcase with all variants, tones, sizes, and states.
        </Text>

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
                  paddingHorizontal: spacing.xxs,
                  marginTop: spacing.xs,
                }}
              >
                <Text
                  variant="labelSmall"
                  color="textSubtle"
                  style={{ textTransform: "uppercase", letterSpacing: 1.2 }}
                >
                  {category.title}
                </Text>
                <Badge tone="secondary" size="sm">
                  {`${category.items.length} items`}
                </Badge>
              </Box>

              {/* Items List with generous gap */}
              <Box gap="md">
                {category.items.map((item) => (
                  <Card key={item.id} padded={false}>
                    <Pressable
                      onPress={() => router.push(`/rn-ui/${item.id}` as never)}
                      style={({ pressed }) => [
                        styles.itemPressable,
                        {
                          backgroundColor: pressed
                            ? colors.backgroundMuted
                            : colors.surface,
                        },
                      ]}
                    >
                      <Box row style={{ alignItems: "center", gap: spacing.md, flex: 1 }}>
                        <Box flex={1} gap="xxs">
                          <Box row style={{ alignItems: "center", gap: spacing.xs }}>
                            <Text variant="label" color="text">
                              {item.name}
                            </Text>
                            {item.tone && (
                              <Badge tone={item.tone} size="sm">
                                {item.id}
                              </Badge>
                            )}
                          </Box>
                          <Text variant="bodySmall" color="textMuted" numberOfLines={1}>
                            {item.description}
                          </Text>
                        </Box>

                        <ChevronRight color={colors.textMuted} size={18} />
                      </Box>
                    </Pressable>
                  </Card>
                ))}
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
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    itemPressable: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.lg,
    },
  }));
}
