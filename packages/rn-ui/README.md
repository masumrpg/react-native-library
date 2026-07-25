# @masumdev/rn-ui

Reusable React Native UI kit with typed theme tokens, flat light/dark mode, pluggable persistence, pluggable fonts, and composable core components.

## Install

```sh
bun add @masumdev/rn-ui
```

Peer dependencies:

```sh
bun add react react-native
```

Optional component peer dependencies:

```sh
# Calendar
bun add react-native-calendars

# BottomSheet
bun add @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler react-native-worklets
```

## Setup

Wrap your app once with `ThemeProvider`.

```tsx
import { ThemeProvider } from '@masumdev/rn-ui';

export default function App() {
  return (
    <ThemeProvider defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

`defaultColorScheme` accepts:

- `light`
- `dark`
- `system`

`system` follows the device color scheme through React Native `useColorScheme()`.

## Usage

```tsx
import { Badge, Box, Button, Card, Text, useTheme } from '@masumdev/rn-ui';

export function Example() {
  const { setColorScheme, toggleColorScheme } = useTheme();

  return (
    <Box flex={1} bg="background" p="lg" gap="md">
      <Card>
        <Badge tone="success">Active</Badge>
        <Text variant="h3">Reusable UI</Text>
        <Text color="textMuted">
          Theme tokens keep spacing, color, typography, and radius consistent.
        </Text>
      </Card>

      <Button fullWidth onPress={toggleColorScheme}>
        Toggle Theme
      </Button>

      <Button variant="outline" onPress={() => setColorScheme('system')}>
        Follow System
      </Button>
    </Box>
  );
}
```

## Custom Theme

Override only the tokens you need. The library deep-merges your values with the default light and dark themes.

```tsx
import { ThemeProvider } from '@masumdev/rn-ui';

const themes = {
  light: {
    colors: {
      primary: '#4F46E5',
      primarySoft: '#EEF2FF',
      onPrimary: '#FFFFFF',
      accent: '#F97316',
    },
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
    },
    typography: {
      body: {
        fontSize: 16,
      },
      label: {
        letterSpacing: 0.2,
      },
    },
    radii: {
      lg: 14,
      xl: 18,
    },
  },
  dark: {
    colors: {
      background: '#08111F',
      surface: '#0F1B2D',
      primary: '#818CF8',
      primarySoft: '#312E81',
      onPrimary: '#111827',
    },
  },
};

export function App() {
  return (
    <ThemeProvider defaultColorScheme="system" themes={themes}>
      <RootNavigator />
    </ThemeProvider>
  );
}
```

## Fonts

Fonts are pluggable. `rn-ui` does not load font files by itself, so it works with Expo Font, local TTF files, React Native CLI font linking, or any other font-loading setup.

Load the font in your app, then pass the registered font names through the `fonts` token.

```tsx
import { useFonts } from 'expo-font';
import { ThemeProvider } from '@masumdev/rn-ui';

const themes = {
  light: {
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
      mono: 'SpaceMono',
    },
  },
  dark: {
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
      mono: 'SpaceMono',
    },
  },
};

export function App() {
  const [loaded] = useFonts({
    OutfitRegular: require('./assets/fonts/Outfit-Regular.ttf'),
    OutfitMedium: require('./assets/fonts/Outfit-Medium.ttf'),
    OutfitSemiBold: require('./assets/fonts/Outfit-SemiBold.ttf'),
    OutfitBold: require('./assets/fonts/Outfit-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider themes={themes}>
      <RootNavigator />
    </ThemeProvider>
  );
}
```

Default mapping:

- `display`, `h1`, `h2` use `fonts.bold`
- `h3`, `title`, `subtitle` use `fonts.semibold`
- `label`, `labelSmall` use `fonts.semibold` or `fonts.medium`
- `body`, `bodySmall`, `caption` use `fonts.regular`

You can still override one typography variant directly:

```tsx
const themes = {
  light: {
    typography: {
      h1: {
        fontFamily: 'CustomDisplayBold',
        fontSize: 34,
        lineHeight: 42,
      },
    },
  },
};
```

## Persisting Theme Choice

The core package does not depend on AsyncStorage, SQLite, Expo SecureStore, MMKV, or Zustand. Pass a small adapter from your app.

`ThemeProvider` waits for storage hydration by default, so the app can avoid rendering light mode before the saved dark mode is loaded.

### Expo SecureStore

```tsx
import * as SecureStore from 'expo-secure-store';
import { ThemeProvider } from '@masumdev/rn-ui';

const storage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export function App() {
  return (
    <ThemeProvider storage={storage} defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

### AsyncStorage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@masumdev/rn-ui';

const storage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
};

export function App() {
  return (
    <ThemeProvider storage={storage} defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

Expo Go support depends on whether the chosen storage native module is available in the runtime. In the native playground, SecureStore is used because it works cleanly with the Expo workflow.

## Logging

The library does not force logging. Apps can decide how noisy persistence logs should be.

Recommended app pattern:

```tsx
const ENABLE_THEME_DEBUG_LOGS = false;

const debugTheme = (...args: unknown[]) => {
  if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
    console.debug('[rn-ui]', ...args);
  }
};

const errorTheme = (...args: unknown[]) => {
  console.error('[rn-ui]', ...args);
};
```

Use debug logs for successful hydrate/save messages and error logs for failed storage operations.

## Components

Current core components:

- `Box`
- `Text`
- `BottomSheet`
- `Accordion`
- `Alert`
- `AlertDialog`
- `Button`
- `IconButton`
- `Badge`
- `Card`
- `Divider`
- `AspectRatio`
- `Attachment`
- `Avatar`
- `Bubble`
- `ButtonGroup`
- `Calendar`
- `Carousel`
- `Checkbox`
- `Collapsible`
- `Combobox`
- `ContextMenu`
- `DropdownMenu`
- `Empty`
- `HoverCard`

Icons are intentionally not tied to Ionicons or Expo. Pass any React node or render function.

```tsx
import { Button } from '@masumdev/rn-ui';
import { Ionicons } from '@expo/vector-icons';

<Button
  leftIcon={({ color, size }) => (
    <Ionicons name="add" color={color} size={size} />
  )}
>
  Create
</Button>
```

### Accordion

Use `Accordion` for expandable flat bordered sections. It supports controlled and uncontrolled state.

```tsx
import { Accordion, Text } from '@masumdev/rn-ui';

<Accordion
  defaultOpenIds={['theme']}
  items={[
    {
      id: 'theme',
      title: 'Theme tokens',
      subtitle: 'Colors, fonts, spacing, and radius',
      content: 'Accordion follows the same flat token-driven style.',
    },
    {
      id: 'icons',
      title: 'Generic icons',
      content: <Text color="textMuted">Icons can be render functions.</Text>,
    },
  ]}
/>
```

Controlled:

```tsx
const [openIds, setOpenIds] = React.useState(['theme']);

<Accordion
  openIds={openIds}
  onOpenChange={setOpenIds}
  allowMultiple
  items={items}
/>
```

Animation:

- Default animation uses React Native `Animated`.
- No extra dependency is required.
- Content animates height and opacity.
- Indicator animates rotation.
- Pass `animated={false}` to disable animation.
- Pass `animationDuration` to tune timing.

```tsx
<Accordion
  animationDuration={220}
  defaultOpenIds={['theme']}
  items={items}
/>
```

Reanimated or custom animation can be plugged in without making `rn-ui` depend on Reanimated:

```tsx
import type {
  AccordionAnimatedContentProps,
  AccordionAnimatedIndicatorProps,
} from '@masumdev/rn-ui';

function ReanimatedAccordionContent(props: AccordionAnimatedContentProps) {
  // App-owned Reanimated implementation.
  return <YourAnimatedContent {...props} />;
}

function ReanimatedAccordionIndicator(props: AccordionAnimatedIndicatorProps) {
  // App-owned Reanimated implementation.
  return <YourAnimatedIndicator {...props} />;
}

<Accordion
  items={items}
  animationComponents={{
    Content: ReanimatedAccordionContent,
    Indicator: ReanimatedAccordionIndicator,
  }}
/>
```

### BottomSheet

Use `BottomSheet` for a theme-aware wrapper around `@gorhom/bottom-sheet`. The app must install Gorhom and its runtime peers.

```sh
bun add @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler react-native-worklets
```

Wrap the app root with `GestureHandlerRootView` at app level:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

<GestureHandlerRootView style={{ flex: 1 }}>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</GestureHandlerRootView>
```

If the app uses Reanimated 4, add the Worklets Babel plugin in the app config:

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

Use the themed wrapper:

```tsx
import {
  BottomSheet,
  BottomSheetView,
  Button,
  Text,
  type BottomSheetMethods,
} from '@masumdev/rn-ui';

const bottomSheetRef = React.useRef<BottomSheetMethods>(null);
const snapPoints = React.useMemo(() => ['35%', '70%'], []);

<Button onPress={() => bottomSheetRef.current?.snapToIndex(0)}>
  Open Sheet
</Button>

<BottomSheet
  ref={bottomSheetRef}
  index={-1}
  snapPoints={snapPoints}
  enablePanDownToClose
>
  <BottomSheetView>
    <Text variant="title">Theme-aware sheet</Text>
  </BottomSheetView>
</BottomSheet>
```

The wrapper maps theme tokens to Gorhom props:

- `backgroundStyle` uses `colors.surface`, `colors.border`, and `radii.xxl`
- `handleIndicatorStyle` uses `colors.border`
- `style` keeps shadow/elevation at zero
- `backdropComponent` defaults to a themed `BottomSheetBackdrop`

Useful wrapper props:

- `withBackdrop`
- `backdropOpacity`
- `backdropAppearsOnIndex`
- `backdropDisappearsOnIndex`
- `backdropPressBehavior`
- `backdropStyle`

Gorhom primitives are re-exported for convenience: `BottomSheetView`, `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetSectionList`, `BottomSheetTextInput`, `BottomSheetModal`, `BottomSheetModalProvider`, `useBottomSheet`, and `useBottomSheetModal`.

### Alert

Use `Alert` for inline feedback. It supports semantic tones, flat variants, generic icons, optional action, and optional close control.

```tsx
import { Alert } from '@masumdev/rn-ui';

<Alert tone="info" title="Information">
  This message uses theme tokens and adapts to light or dark mode.
</Alert>
```

With icon and action:

```tsx
<Alert
  tone="success"
  variant="outline"
  icon={({ color, size }) => <Icon name="check" color={color} size={size} />}
  action={{
    label: 'View details',
    onPress: openDetails,
  }}
>
  Your changes were saved.
</Alert>
```

Dismissible alert:

```tsx
<Alert
  tone="warning"
  title="Unsaved changes"
  dismissible
  closeIcon={({ color, size }) => <Icon name="x" color={color} size={size} />}
>
  This alert removes itself when the close button is pressed.
</Alert>
```

`icon`, `action.icon`, and `closeIcon` are all pluggable through `RenderIcon`.

Dismiss animations use React Native `Animated` by default. Use `animated={false}` to disable or `animationDuration` to tune timing.

```tsx
<Alert dismissible animationDuration={220}>
  Animated dismissible alert.
</Alert>
```

Action icons can be fully overridden, including custom open/close animation owned by the app:

```tsx
<Alert
  action={{
    label: expanded ? 'Hide details' : 'View details',
    icon: ({ color, size }) => (
      <AnimatedChevron expanded={expanded} color={color} size={size} />
    ),
    onPress: () => setExpanded((value) => !value),
  }}
>
  Alert content.
</Alert>
```

### AlertDialog

Use `AlertDialog` for modal confirmation and blocking feedback. It uses React Native `Modal` and React Native `Animated` by default.

```tsx
const [visible, setVisible] = React.useState(false);

<Button onPress={() => setVisible(true)}>Delete</Button>

<AlertDialog
  visible={visible}
  tone="danger"
  title="Delete item?"
  description="This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={deleteItem}
  onCancel={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>
```

With pluggable icons:

```tsx
<AlertDialog
  visible={visible}
  icon={({ color, size }) => <Trash color={color} size={size} />}
  closeIcon={({ color, size }) => <X color={color} size={size} />}
  onClose={() => setVisible(false)}
/>
```

Useful props:

- `dismissOnBackdropPress`
- `confirmLoading`
- `confirmDisabled`
- `cancelDisabled`
- `animated`
- `animationDuration`
- `modalProps`

Android notes:

- `AlertDialog` enables `statusBarTranslucent`, `navigationBarTranslucent`, and `hardwareAccelerated` by default so the backdrop can cover modern Android system UI areas more consistently.
- If an app uses custom edge-to-edge or navigation bar handling, override native modal behavior through `modalProps`.
- Android navigation bar behavior is controlled by system UI, not by the modal backdrop view. If the app needs to hide or style the navigation bar while a dialog is open, handle it at app level with the system UI solution already used by that app. `rn-ui` does not depend on Expo navigation-bar APIs.

### AspectRatio

Use `AspectRatio` to display layout/media with a specific proportion. The child element automatically stretches to fill the container.

```tsx
import { AspectRatio } from '@masumdev/rn-ui';
import { Image } from 'react-native';

<AspectRatio ratio={16 / 9} radius="md">
  <Image
    source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' }}
    style={{ resizeMode: 'cover' }}
  />
</AspectRatio>
```

### Attachment

Use `Attachment` to represent file/image uploads or documents. Supports grid-like `card` previews and full-width list `row` views with status indicators.

```tsx
import { Attachment } from '@masumdev/rn-ui';

// Card layout (Image preview)
<Attachment
  layout="card"
  name="workspace.png"
  description="PNG • 820 KB"
  thumbnail="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
  onRemove={removeFile}
/>

// Row layout (Document preview)
<Attachment
  layout="row"
  name="sales-dashboard.pdf"
  description="Uploading • 64%"
  descriptionTone="info"
  loading
  onRemove={removeFile}
/>
```

`descriptionTone` accepts `default`, `info`, `success`, `warning`, and `danger`. Use it instead of deriving visual state from description copy. `thumbnail`, `fileIcon`, and `closeIcon` are pluggable through `RenderIcon`.

### Avatar

Use `Avatar` to display user profile images. Supports sizes (`sm`, `default`, `lg`), custom fallback placeholders, activity badges, and overlapping avatar groups.

```tsx
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from '@masumdev/rn-ui';

// Individual Avatar with Badge
<Avatar size="lg">
  <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }} />
  <AvatarFallback>JD</AvatarFallback>
  <AvatarBadge bg={colors.success} />
</Avatar>

// Avatar Group
<AvatarGroup size="default">
  <Avatar>
    <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }} />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' }} />
    <AvatarFallback>AM</AvatarFallback>
  </Avatar>
  <AvatarGroupCount count={5} />
</AvatarGroup>
```

### Bubble

Use `BubbleGroup`, `Bubble`, `BubbleContent`, and `BubbleReactions` to display conversation bubbles (chat messages) with support for variants, alignments, and overlay reaction tags.

```tsx
import {
  BubbleGroup,
  Bubble,
  BubbleContent,
  BubbleReactions,
  Text,
} from '@masumdev/rn-ui';

<BubbleGroup>
  {/* Incoming message */}
  <Bubble align="start" variant="secondary">
    <BubbleContent>Hello! How can I help you today?</BubbleContent>
  </Bubble>

  {/* Outgoing message with reactions */}
  <Bubble align="end" variant="default">
    <BubbleContent>I'd like to customize the colors of my theme.</BubbleContent>
    <BubbleReactions side="bottom" align="end">
      <Text style={{ fontSize: 11 }}>👍 1</Text>
    </BubbleReactions>
  </Bubble>
</BubbleGroup>
```

### ButtonGroup

Use `ButtonGroup` to group buttons, static text containers, and separators horizontally or vertically with unified borders and border radii.

```tsx
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  Button,
} from '@masumdev/rn-ui';

<ButtonGroup orientation="horizontal">
  <ButtonGroupText>Prefix</ButtonGroupText>
  <Button variant="outline">Action A</Button>
  <ButtonGroupSeparator />
  <Button variant="outline">Action B</Button>
</ButtonGroup>
```

### Calendar

Use `Calendar` to render date pickers and handle single date or range select.

```tsx
import { Calendar } from '@masumdev/rn-ui';

<Calendar
  markedDates={{
    '2026-07-12': { selected: true, startingDay: true },
    '2026-07-13': { selected: true, color: 'muted' },
    '2026-07-14': { selected: true, endingDay: true },
  }}
/>
```

### Carousel

Use `Carousel` for horizontally scrollable card decks. Pagination is on by default and next/previous icons are pluggable.

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@masumdev/rn-ui';

<Carousel itemWidth={280}>
  <CarouselContent>
    <CarouselItem>
      <Card><Text>Slide one</Text></Card>
    </CarouselItem>
    <CarouselItem>
      <Card><Text>Slide two</Text></Card>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious icon={({ color, size }) => <ChevronLeft color={color} size={size} />} />
  <CarouselNext icon={({ color, size }) => <ChevronRight color={color} size={size} />} />
</Carousel>
```

### Checkbox

Use `Checkbox` for controlled boolean state. The check icon is pluggable.

```tsx
<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  icon={({ color, size }) => <Check color={color} size={size} />}
/>
```

### Collapsible

Use `Collapsible` for composable expandable content.

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>
    <Text variant="label">Toggle details</Text>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <Text color="textMuted">Hidden content.</Text>
  </CollapsibleContent>
</Collapsible>
```

### Combobox

Use `Combobox` for searchable selection. It uses React Native `Modal` by default, stays flat by default, and exposes `modalProps`, `overlayStyle`, `chevronIcon`, and `checkIcon` for app-level customization.

```tsx
<Combobox value={value} onValueChange={setValue}>
  <ComboboxInput
    placeholder="Select framework"
    chevronIcon={({ color, size }) => <ChevronsUpDown color={color} size={size} />}
  />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="expo" label="Expo">Expo</ComboboxItem>
      <ComboboxItem value="react-native" label="React Native">React Native</ComboboxItem>
      <ComboboxEmpty>No results.</ComboboxEmpty>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

### ContextMenu

Use `ContextMenu` for long-press menus. It uses React Native `Modal` by default and keeps system UI behavior app-overridable through `modalProps`.

```tsx
<ContextMenu>
  <ContextMenuTrigger>
    <Button variant="outline">Long press</Button>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Actions</ContextMenuLabel>
    <ContextMenuItem onPress={editItem}>Edit</ContextMenuItem>
    <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
      Pinned
    </ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive" onPress={deleteItem}>
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### DropdownMenu

Use `DropdownMenu` for tap-triggered action menus. It uses React Native `Modal`, Reanimated entry animation, flat bordered styling, alignment control, checkbox items, shortcuts, and app-overridable modal/backdrop props.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger style={triggerStyle}>
    <Text variant="label">Open menu</Text>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem onPress={refreshList}>
      Refresh
      <DropdownMenuShortcut>R</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuCheckboxItem checked={compact} onCheckedChange={setCompact}>
      Compact mode
    </DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onPress={deleteItem}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Useful props:

- `open`, `defaultOpen`, and `onOpenChange`
- `align="start" | "end"`
- `width`, `maxHeight`, and `sideOffset`
- `modalProps` and `overlayStyle`
- `checkIcon` on `DropdownMenuCheckboxItem`

Avoid nesting another `Pressable` or `Button` directly inside `DropdownMenuTrigger`; style the trigger itself or render non-pressable visual children inside it.

### Empty

Use `Empty` for empty states such as no projects, no data, or no search results. It is composable and mirrors the web pattern with React Native primitives.

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <FileText color={colors.text} size={16} />
    </EmptyMedia>
    <EmptyTitle>Expo React Native</EmptyTitle>
    <EmptyDescription>
      Expo React Native by Ma'sum. Crafted for consistent mobile UI in 2026.
    </EmptyDescription>
  </EmptyHeader>

  <EmptyContent>
    <Box row center gap="sm">
      <Button size="sm">Explore 2026</Button>
      <Button size="sm" variant="outline" tone="secondary">
        by Ma'sum
      </Button>
    </Box>
    <Button size="sm" variant="ghost" tone="secondary">
      Expo React Native
    </Button>
  </EmptyContent>
</Empty>
```

Parts:

- `Empty`
- `EmptyHeader`
- `EmptyMedia`
- `EmptyTitle`
- `EmptyDescription`
- `EmptyContent`

### HoverCard

Use `HoverCard` for richer contextual previews. On mobile, the default trigger is `longPress`.

```tsx
<HoverCard openDelay={10} closeDelay={100}>
  <HoverCardTrigger style={triggerStyle}>
    <Text variant="label" color="primary">Expo React Native</Text>
  </HoverCardTrigger>
  <HoverCardContent>
    <Box gap="xs">
      <Text variant="label">Expo React Native</Text>
      <Text variant="bodySmall" color="textMuted">
        Expo React Native by Ma'sum.
      </Text>
      <Text variant="caption" color="textSubtle">
        Highlight 2026
      </Text>
    </Box>
  </HoverCardContent>
</HoverCard>
```

Useful props:

- `open`, `defaultOpen`, and `onOpenChange`
- `openDelay` and `closeDelay`
- `triggerMode="longPress" | "press" | "manual"`
- `align="start" | "center" | "end"`
- `width`, `maxHeight`, `sideOffset`, `modalProps`, and `overlayStyle`

### Input

Use `Input` for token-based text fields. It wraps React Native `TextInput`, supports light/dark mode, and keeps the default style flat with a clear border.

```tsx
const [value, setValue] = React.useState("Expo React Native by Ma'sum");

<Input
  value={value}
  onChangeText={setValue}
  placeholder="Expo React Native by Ma'sum"
/>

<Input
  type="email"
  placeholder="expo-react-native@masum.dev"
/>

<Input
  invalid
  value="Expo React Native by Ma'sum, 2026"
  onChangeText={() => undefined}
/>
```

Useful props:

- `type="text" | "email" | "number" | "password" | "tel" | "url"`
- `size="sm" | "md" | "lg"`
- `invalid`, `disabled`, and `fullWidth`
- All standard React Native `TextInputProps`

### InputGroup

Use `InputGroup` when an input needs inline addons, result counts, small actions, or a multiline grouped field.

```tsx
<InputGroup>
  <InputGroupAddon>
    <Search color={colors.textMuted} size={16} />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon align="inline-end">
    <InputGroupText>12 results</InputGroupText>
  </InputGroupAddon>
</InputGroup>

<InputGroup>
  <InputGroupInput placeholder="Enter password" secureTextEntry />
  <InputGroupAddon align="inline-end">
    <EyeOff color={colors.textMuted} size={16} />
  </InputGroupAddon>
</InputGroup>

<InputGroup orientation="block">
  <InputGroupAddon align="block-start">
    <InputGroupText>Expo React Native by Ma'sum</InputGroupText>
  </InputGroupAddon>
  <InputGroupTextarea placeholder="Highlight 2026" />
  <InputGroupAddon align="block-end">
    <InputGroupButton size="xs">Send</InputGroupButton>
  </InputGroupAddon>
</InputGroup>

<InputGroup orientation="block">
  <InputGroupInput placeholder="Enter amount" />
  <InputGroupAddon align="block-end">
    <InputGroupText>USD</InputGroupText>
  </InputGroupAddon>
</InputGroup>
```

Parts:

- `InputGroup`
- `InputGroupAddon`
- `InputGroupButton`
- `InputGroupText`
- `InputGroupInput`
- `InputGroupTextarea`

Useful props:

- `orientation="inline" | "block"`
- `InputGroupAddon align="inline-start" | "inline-end" | "block-start" | "block-end"`
- `InputGroupButton size="xs" | "sm" | "icon-xs" | "icon-sm"`
- `invalid` and `disabled` can be set on the group or input control

### InputOTP

Use `InputOTP` for one-time passcode fields. The root owns the hidden native `TextInput`; slots render the visual code boxes.

```tsx
const [otp, setOtp] = React.useState("");

<InputOTP value={otp} onChangeText={setOtp} maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSeparator />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>

<InputOTP maxLength={4} invalid>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
```

Parts:

- `InputOTP`
- `InputOTPGroup`
- `InputOTPSlot`
- `InputOTPSeparator`

Useful props:

- `value`, `defaultValue`, and `onChangeText`
- `maxLength`, `disabled`, `invalid`, and `autoFocus`
- `textInputProps` for native `TextInput` overrides

### Item

Use `Item` primitives for reusable list rows and grouped content.

```tsx
<ItemGroup>
  <Item variant="outline">
    <ItemMedia variant="icon">
      <Inbox color={colors.primary} size={20} />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Expo React Native</ItemTitle>
      <ItemDescription>
        Reusable item row by Ma'sum for consistent 2026 mobile lists.
      </ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge tone="success" variant="soft">Active</Badge>
    </ItemActions>
  </Item>

  <ItemSeparator />

  <Item variant="muted" size="sm">
    <ItemHeader>
      <ItemTitle>Theme tokens</ItemTitle>
      <Badge tone="info" variant="outline">2026</Badge>
    </ItemHeader>
    <ItemContent>
      <ItemDescription>Header and footer areas stay full width.</ItemDescription>
    </ItemContent>
    <ItemFooter>
      <Text variant="caption" color="textMuted">by Ma'sum</Text>
      <Button size="xs" variant="ghost" tone="secondary">View</Button>
    </ItemFooter>
  </Item>
</ItemGroup>
```

Parts:

- `ItemGroup`
- `Item`
- `ItemMedia`
- `ItemContent`
- `ItemTitle`
- `ItemDescription`
- `ItemActions`
- `ItemHeader`
- `ItemFooter`
- `ItemSeparator`

Useful props:

- `Item variant="default" | "outline" | "muted"`
- `Item size="default" | "sm" | "xs"`
- `ItemMedia variant="default" | "icon" | "image"`

### Toast

Wrap the app once with `ToastProvider`, then use `useToast()` from any screen.

```tsx
<ThemeProvider>
  <ToastProvider placement="top">
    <App />
  </ToastProvider>
</ThemeProvider>
```

```tsx
const toast = useToast();

toast.show({
  title: "Expo React Native",
  description: "Toast by Ma'sum for 2026 mobile UI.",
  tone: "success",
  icon: ({ color, size }) => <Check color={color} size={size} />,
  action: {
    label: "Undo",
    onPress: handleUndo,
  },
});
```

Parts and APIs:

- `ToastProvider`
- `useToast`
- `ToastViewport`
- `Toast`
- `ToastContent`
- `ToastTitle`
- `ToastDescription`
- `ToastAction`
- `ToastClose`

Useful props:

- `ToastProvider placement="top" | "bottom"`
- `offset` to control distance from the top/bottom edge; Android top placement accounts for `StatusBar.currentHeight`, and Android bottom placement leaves extra room for navigation controls by default
- `duration`, `maxToasts`, `swipeToDismiss`, `viewportStyle`, and `renderToast`
- `toast.show({ title, description, tone, icon, closeIcon, action, duration })`
- `toast.dismiss(id?)` and `toast.update(id, options)`

### Form And Controls

Use these primitives for common form, preference, loading, and local navigation UI.

```tsx
<FormField required>
  <FormLabel>Expo React Native</FormLabel>
  <FormControl>
    <Input placeholder="Expo React Native by Ma'sum" />
  </FormControl>
  <FormDescription>Consistent field copy.</FormDescription>
  <FormMessage>Shown when the field is invalid.</FormMessage>
</FormField>

<Label required requiredIndicator=" (required)">
  Expo React Native
</Label>

<Switch value={enabled} onValueChange={setEnabled} />

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="expo" label="Expo React Native" />
</RadioGroup>

<Slider value={64} onValueChange={setValue} />
<Progress value={64} />
<Skeleton style={{ height: 16, width: "72%" }} />

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="tokens">Tokens</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">
    <Text>Expo React Native by Ma'sum</Text>
  </TabsContent>
</Tabs>

<Stepper value={2} onValueChange={setValue} min={0} max={9} />
```

Parts and APIs:

- `Label` with `required`, `requiredIndicator`, and `requiredIndicatorStyle`
- `FormField`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField`
- `Switch`
- `RadioGroup` and `RadioGroupItem`
- `Slider`
- `Progress`
- `Skeleton`
- `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`
- `Stepper`

### Sheet

Use `Sheet` as a higher-level wrapper around the package BottomSheet integration.

```tsx
<Sheet ref={sheetRef} index={-1} snapPoints={["35%", "70%"]}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Expo React Native Sheet</SheetTitle>
      <SheetDescription>by Ma'sum, 2026.</SheetDescription>
    </SheetHeader>
    <SheetFooter>
      <Button onPress={() => sheetRef.current?.close()}>Close</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

Parts:

- `Sheet`
- `SheetContent`
- `SheetHeader`
- `SheetTitle`
- `SheetDescription`
- `SheetFooter`

### Data And Overlays

Use these primitives for multiline fields, mobile selection, command sheets, anchored content, and compact data display.

```tsx
<Textarea placeholder="Write Expo React Native notes by Ma'sum..." />

<Select
  value={value}
  onValueChange={setValue}
  options={[{ value: "expo", label: "Expo React Native" }]}
/>

<Command
  visible={visible}
  onClose={close}
  items={[{ value: "theme", label: "Theme tokens" }]}
  onSelect={handleSelect}
/>

<Popover>
  <PopoverTrigger>
    <Text>Open Popover</Text>
  </PopoverTrigger>
  <PopoverContent>
    <Text>Expo React Native by Ma'sum</Text>
  </PopoverContent>
</Popover>

<Pagination page={1} pageCount={5} onPageChange={setPage} />

<Breadcrumb>
  <BreadcrumbLink>Expo</BreadcrumbLink>
  <BreadcrumbSeparator />
  <BreadcrumbPage>Ma'sum</BreadcrumbPage>
</Breadcrumb>

<Table>
  <TableRow>
    <TableHead>Name</TableHead>
    <TableHead>Status</TableHead>
  </TableRow>
  <TableRow>
    <TableCell>Expo React Native</TableCell>
    <TableCell>Active</TableCell>
  </TableRow>
</Table>

<DataList>
  <DataListItem>
    <DataListLabel>Framework</DataListLabel>
    <DataListValue>Expo React Native</DataListValue>
  </DataListItem>
</DataList>

<Timeline>
  <TimelineItem active>
    <TimelineTitle>Theme tokens</TimelineTitle>
    <TimelineDescription>Flat border system by Ma'sum.</TimelineDescription>
  </TimelineItem>
</Timeline>

<MetricCard label="Expo React Native" value="2026" />
```

Parts and APIs:

- `Textarea`
- `Select`
- `Command`
- `Popover`, `PopoverTrigger`, and `PopoverContent`
- `Pagination`
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, and `BreadcrumbSeparator`
- `Table`, `TableRow`, `TableHead`, and `TableCell`
- `DataList`, `DataListItem`, `DataListLabel`, and `DataListValue`
- `Timeline`, `TimelineItem`, `TimelineTitle`, and `TimelineDescription`
- `MetricCard`

### KeyboardAvoiding

Use `KeyboardAvoiding` for form screens that need keyboard-safe layout. It wraps React Native `KeyboardAvoidingView` and can optionally include a themed `ScrollView`.

```tsx
<KeyboardAvoiding scroll p="lg" gap="md">
  <Text variant="title">Expo React Native</Text>
  <Input placeholder="Expo React Native by Ma'sum" />
  <Button>Highlight 2026</Button>
</KeyboardAvoiding>

<KeyboardAvoiding enabled={false}>
  <Input placeholder="Managed by the app keyboard layer" />
</KeyboardAvoiding>
```

For Android Expo apps, set the app window to resize so the keyboard can move content predictably:

```json
{
  "expo": {
    "android": {
      "softwareKeyboardLayoutMode": "resize"
    }
  }
}
```

Useful props:

- `scroll` to render a keyboard-friendly `ScrollView`
- `bg`, `p`, `px`, `py`, and `gap` for token-based layout
- `fullHeight` to control whether the wrapper uses `flex: 1`
- `enabled={false}` to disable keyboard avoiding when the app uses another keyboard library
- `keyboardVerticalOffset`, `behavior`, and `enabled` from React Native `KeyboardAvoidingView`
- `scrollViewProps` for `keyboardShouldPersistTaps`, `contentInsetAdjustmentBehavior`, and other `ScrollView` options

## Folder Structure

```txt
src/
  components/
    Accordion.tsx
    Alert.tsx
    AlertDialog.tsx
    AspectRatio.tsx
    Attachment.tsx
    Avatar.tsx
    BottomSheet.tsx
    Bubble.tsx
    ButtonGroup.tsx
    Calendar.tsx
    Carousel.tsx
    Checkbox.tsx
    Collapsible.tsx
    Combobox.tsx
    ContextMenu.tsx
    Command.tsx
    DataList.tsx
    DropdownMenu.tsx
    Empty.tsx
    HoverCard.tsx
    Input.tsx
    InputGroup.tsx
    InputOTP.tsx
    Item.tsx
    KeyboardAvoiding.tsx
    Label.tsx
    MetricCard.tsx
    Pagination.tsx
    Popover.tsx
    FormField.tsx
    Progress.tsx
    RadioGroup.tsx
    Sheet.tsx
    Skeleton.tsx
    Slider.tsx
    Stepper.tsx
    Switch.tsx
    Tabs.tsx
    Table.tsx
    Textarea.tsx
    Timeline.tsx
    Toast.tsx
    Badge.tsx
    Box.tsx
    Button.tsx
    Card.tsx
    Divider.tsx
    IconButton.tsx
    Text.tsx
    index.ts
  theme/
    ThemeProvider.tsx
    createTheme.ts
    index.ts
    tokens.ts
    types.ts
    useTheme.ts
    useThemeStyles.ts
  utils/
    color.ts
    index.ts
  index.ts
```

## Design Notes

- The default visual style is flat: no shadow/elevation by default, stronger borders, semantic surfaces, and consistent rounded corners.
- Default primary color uses a modern indigo palette: `#4F46E5` in light mode and `#818CF8` in dark mode.
- Use semantic colors such as `background`, `surface`, `text`, `primary`, `danger`, and `border` instead of hardcoded hex values.
- Use `spacing`, `radii`, `fonts`, and `typography` tokens from `useTheme()` or `useThemeStyles()`.
- Keep app-specific storage, fonts, icons, and haptics outside the UI core.
- Add new components through `components/` and export them from `components/index.ts`.
- When changing package APIs, tokens, default visuals, persistence behavior, or app integration examples, update this README in the same change.

## Development Rules

See [`RULES.md`](./RULES.md) for file structure rules, code style rules, component conventions, usage patterns, logging rules, and verification checklist.
