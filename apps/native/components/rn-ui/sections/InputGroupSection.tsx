import React from "react";
import { Animated, Image, View } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function InputGroupSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
