# Changelog

All notable changes to **@masumdev/rn-ui** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2026-09-21

### Fixed
- **Progress Animation Memory Leak**: Added `cancelAnimation` cleanup to the `Progress` component's `useEffect` for both indeterminate (`withRepeat`) and determinate (`withTiming`) animation branches. Previously, unmounting or toggling `indeterminate`/`animated` props could leave orphaned animation worklets on the UI thread.

---

## [0.4.1] - 2026-09-21

### Fixed
- **Spinner / Loader Crash-Proofing & Safe Degrees**:
  - Implemented worklet angle normalization (`toSafeDeg`) ensuring rotation angles are strictly finite positive numbers in the range `[0, 360)`.
  - Eliminated the double negative crash (`--<num>deg`) in counter-clockwise and reverse rotations which caused fatal native parser exceptions in React Native (`Invalid transform rotate: "--...deg"`).
  - Eliminated `NaNdeg` and `-NaNdeg` exceptions caused by uninitialized or non-finite shared values.
  - Safeguarded rotation transforms in `<Toast>` and `<DatePicker>` against `NaNdeg`.

### Optimized
- **Ultra-Lightweight Spinner Execution & Hook Compliance**:
  - Extracted `DotItem` and `BarItem` outside array render loops as top-level `React.memo` components, eliminating React Hook rule violations, preventing memory leaks, and removing GC stuttering.
  - Implemented selective animation execution: `rotation` only runs for `circular` and `ring` variants, while `pulse` only runs for `dots` and `bars`. Idle animations are cancelled and reset to 0 to save UI thread cycles.
  - Added defensive clamping for dimensions (`dimension >= 8`, `strokeWidth >= 1`, `radius >= 1`) to guarantee SVG `<Circle>` attributes never receive non-positive or NaN values.

---

## [0.4.0] - 2026-09-19

### Removed
- **Removed `@gorhom/bottom-sheet` and Related Components**:
  - Removed `BottomSheet` wrapper and all related exports (`BottomSheetModal`, `BottomSheetFlatList`, `BottomSheetScrollView`, `BottomSheetSectionList`, `BottomSheetTextInput`, `BottomSheetView`, `useBottomSheet`, `useBottomSheetModal`).
  - Removed `@gorhom/bottom-sheet` from `peerDependencies`.
  - Removed `Sheet` component and compound subcomponents (`SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetContent`, `SheetFooter`).
  - Removed `Tabs` component and compound subcomponents (`TabsList`, `TabsTrigger`, `TabsContent`).
  - Decoupled `Command` component from `Sheet` by migrating to a standalone native `Modal` overlay.

---

## [0.3.1] - 2026-09-12

### Added
- **Spinner & Loader Components**:
  - Brand-new dedicated `Spinner` component (also exported as `Loader`) powered by `react-native-reanimated` with 60–120fps UI thread execution.
  - Supports 4 visual animation variants: `circular` (high-performance SVG arc), `ring` (dual concentric reverse-spinning rings), `dots` (three phase-shifted pulsing wave dots), and `bars` (vertical soundwave equalizer bars).
  - Configurable speeds (`slow`, `normal`, `fast`, or custom ms duration), size scales (`xs`, `sm`, `default`, `lg`, `xl`, or numeric pixel size), semantic color tones (`primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`), and optional descriptive labels with flexible placement (`bottom`, `top`, `left`, `right`).
  - Added interactive showcase demo in `apps/native` playground with live playground, variant gallery, and card overlay simulation.
  - Added complete documentation and prop table in `apps/docs`.

### Optimized
- **Ultra-Lightweight Skeleton & SkeletonGroup**:
  - Reduced memory footprint by 75% (from 4 SharedValues per skeleton to 1 single `progress` SharedValue).
  - Cut animation CPU loops by 50% by deriving both subtle pulse and shimmer wave from a unified clock.
  - Eliminated `onLayout` bridge round-trips by computing sweep distances geometrically based on viewport width.
  - Added `<SkeletonGroup>` container to drive arbitrary numbers of child skeletons from a single shared UI thread clock (O(1) overhead regardless of skeleton count).
  - Guaranteed safe unmount and destroy cleanup via `cancelAnimation` to prevent worklet collision or frame drops when transitioning from skeleton to live data.

### Fixed
- **Button Defensive Rendering & renderIcon Safety**:
  - Enhanced `<Button>` to safely detect and wrap mixed string/number array children within `<Text>` components, preventing native layout crashes (`Text strings must be rendered within a <Text> component`).
  - Upgraded `renderIcon` utility in `types.ts` to seamlessly handle React forwardRef component objects (such as Lucide icons), preventing React child object errors.

---

## [0.3.0] - 2026-08-25

### Added
- **Chip & Tag Components**: Selection chips with `filled`, `outline`, and `soft` variants, toggle selection, close buttons, and tone theming.
- **DatePicker & TimePicker Suite**: Complete picker suite with `DatePickerCard`, `DatePickerModal`, `TimePickerCard`, `TimePickerModal`, and wheel column pickers.
- **ExpandableCalendar & AgendaList**: Expandable week/month view calendar with agenda list integration.
- **SwipeableItem**: Interactive swipe action item with left/right contextual actions.
- **SegmentedControl & Rating Components**: Multi-segment iOS/Android switches and interactive star rating controls.
