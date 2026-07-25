import React from "react";
import { Animated, Image, View, type LayoutChangeEvent } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function ButtonGroupsSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, padding, activeBlockWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
