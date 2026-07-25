import React from "react";
import { Animated, Image, View } from "react-native";
import {
  Check, ChevronRight, CircleAlert, Copy, EyeOff, FileCode, FileText, Heart, HelpCircle, Inbox, Moon, Palette, Plus, Minus, Settings, Smartphone, Search, BarChart3, Sun, Trash, X, ChevronsUpDown, ArrowLeft,
} from "lucide-react-native";
import {
  Accordion, Alert, AlertDialog, AspectRatio, Attachment, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount, Badge, Box, Bubble, BubbleContent, BubbleGroup, BubbleReactions, Button, ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Calendar, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Checkbox, Collapsible, CollapsibleTrigger, CollapsibleContent, Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuCheckboxItem, ContextMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuShortcut, Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Card, Divider, HoverCard, HoverCardContent, HoverCardTrigger, IconButton, Input, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, KeyboardAvoiding, Label, FormControl, FormDescription, FormField, FormLabel, FormMessage, Progress, RadioGroup, RadioGroupItem, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Skeleton, Slider, Stepper, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Command, DataList, DataListItem, DataListLabel, DataListValue, MetricCard, Pagination, Popover, PopoverContent, PopoverTrigger, Select, Table, TableCell, TableHead, TableRow, Textarea, Timeline, TimelineDescription, TimelineItem, TimelineTitle, Text, type ColorSchemePreference,
} from "@masumdev/rn-ui";
import { Section, AnimatedDetail, AnimatedToggleIcon, type RnUiSectionContext } from "../shared";

export function ChatBubblesSection({ ctx }: { ctx: RnUiSectionContext }) {
  const {
    colors, radii, styles, icon, themeOptions, colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme, showAlertDetails, setShowAlertDetails, setAlertDialogVisible, activeSegment, setActiveSegment, containerWidth, setContainerWidth, translateX, selectedDate, setSelectedDate, rangeStart, rangeEnd, handleRangePress, getRangeMarkedDates, checkOne, setCheckOne, checkTwo, setCheckTwo, framework, setFramework, sampleInput, setSampleInput, searchQuery, setSearchQuery, otpValue, setOtpValue, switchEnabled, setSwitchEnabled, radioValue, setRadioValue, sliderValue, setSliderValue, stepperValue, setStepperValue, tabValue, setTabValue, selectValue, setSelectValue, setCommandVisible, page, setPage, showBookmark, setShowBookmark, compactMenu, setCompactMenu, bottomSheetRef, toast,
  } = ctx;

  return (
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
  );
}
