import React from "react";
import { Animated, Image, View } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function CollapsibleSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
