import React from "react";
import { Animated, Image, View } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function DropdownMenuSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
