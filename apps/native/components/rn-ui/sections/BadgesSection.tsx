import React from "react";
import { Animated, Image, View } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function BadgesSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
