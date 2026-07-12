# @masumdev/rn-ui Rules

Rules for developing and maintaining `@masumdev/rn-ui`.

## Package Goals

- Keep the library small, reusable, and React Native friendly.
- Keep app-specific choices outside the core package: storage, font loading, icon libraries, haptics, navigation, and analytics.
- Prefer flat design defaults: no shadow/elevation by default, clear borders, semantic colors, stable spacing, and consistent rounded corners.
- Every public API, token, component behavior, or integration change must be documented in `packages/rn-ui/README.md`.

## File Structure

Use this structure for new work:

```txt
src/
  components/
    ComponentName.tsx
    index.ts
    types.ts
  theme/
    ThemeProvider.tsx
    createTheme.ts
    index.ts
    tokens.ts
    types.ts
    useTheme.ts
    useThemeStyles.ts
  utils/
    helperName.ts
    index.ts
  index.ts
README.md
RULES.md
```

Rules:

- Put reusable UI components in `src/components/`.
- Put theme tokens, provider, hooks, and theme types in `src/theme/`.
- Put small shared helpers in `src/utils/`.
- Export new components from `src/components/index.ts`.
- Export new public theme APIs from `src/theme/index.ts`.
- Export public package APIs from `src/index.ts`.
- Do not import from app paths such as `apps/native` or sample paths.
- Do not add package-level dependencies for optional app concerns unless the component cannot work without them.

## Code Style

- Use TypeScript for every source file.
- Prefer named exports over default exports.
- Keep props interfaces exported when the component is public.
- Use `React.ReactNode` only when needed; for icon props prefer the existing `RenderIcon` type.
- Keep components controlled by props and theme tokens, not hidden app state.
- Keep components platform-neutral unless a React Native API is required.
- Avoid hardcoded colors in components. Use `theme.colors`.
- Avoid hardcoded spacing/radius values in components. Use `theme.spacing` and `theme.radii`.
- Avoid shadows/elevation by default. The default visual language is flat.
- Do not tie components to Ionicons, Expo, Reanimated, Haptics, navigation, or storage by default.
- If a component needs optional behavior, expose a prop or render function instead of importing an app-specific library.
- Keep comments short and only where they clarify non-obvious logic.

## Theme Rules

Theme tokens are the source of visual truth.

Public token groups:

- `colors`
- `fonts`
- `typography`
- `spacing`
- `radii`
- `shadows`
- `components`

Rules:

- Add new visual decisions as tokens before hardcoding them into components.
- Use semantic colors: `background`, `surface`, `text`, `textMuted`, `primary`, `danger`, `border`, etc.
- Keep light and dark theme token names symmetrical.
- Keep `system` mode based on React Native color scheme detection.
- Keep persistence pluggable through a storage adapter with `getItem` and `setItem`.
- Keep font loading outside the library. The app loads fonts and passes registered names through `fonts`.
- Typography should use `fonts` by default, while still allowing direct per-variant overrides.

## Component Rules

Current public components:

- `Box`
- `Text`
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

When adding a component:

- Create `src/components/ComponentName.tsx`.
- Export it and its public types from `src/components/index.ts`.
- Use theme tokens for all visual styling.
- Support light and dark mode automatically.
- Keep defaults flat and border-based.
- Accept `style` overrides where reasonable.
- Keep icon support generic with `RenderIcon` or render props.
- Add usage docs to `README.md`.
- Add the component to the component list in this file.
- Add a sample for the component in `apps/native/app/rn-ui.tsx`.
- Run package build and app typecheck before finishing.

## Component Usage

### ThemeProvider

```tsx
import { ThemeProvider } from '@masumdev/rn-ui';

<ThemeProvider defaultColorScheme="system">
  <App />
</ThemeProvider>
```

With pluggable storage:

```tsx
const storage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

<ThemeProvider storage={storage} defaultColorScheme="system">
  <App />
</ThemeProvider>
```

### Box

Use `Box` for layout primitives.

```tsx
<Box flex={1} bg="background" p="lg" gap="md">
  <Box row center gap="sm">
    <Text>Content</Text>
  </Box>
</Box>
```

### Text

Use `Text` for token-based typography.

```tsx
<Text variant="h1">Heading</Text>
<Text color="textMuted">Secondary copy</Text>
```

### Accordion

Use `Accordion` for expandable flat bordered sections.

```tsx
<Accordion
  defaultOpenIds={['theme']}
  items={[
    {
      id: 'theme',
      title: 'Theme tokens',
      subtitle: 'Colors, fonts, spacing, and radius',
      content: 'Accordion follows the same token-driven flat style.',
    },
  ]}
/>
```

Use controlled state when the app needs to own open/closed state.

```tsx
<Accordion
  openIds={openIds}
  onOpenChange={setOpenIds}
  allowMultiple
  items={items}
/>
```

Accordion animation rules:

- Default animation must use React Native `Animated`.
- Do not import `react-native-reanimated` in `rn-ui`.
- Reanimated support must stay pluggable through `animationComponents`.
- Keep `animated={false}` available for users who want no animation.

### Alert

Use `Alert` for inline feedback and status messages.

```tsx
<Alert tone="info" title="Information">
  This message uses semantic tokens.
</Alert>
```

With generic icon and action:

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

Dismissible alerts should remove themselves when `dismissible` is true. `icon`, `action.icon`, and `closeIcon` must stay pluggable. Dismiss animation should use React Native `Animated` by default and remain disableable through `animated={false}`. If an Alert action needs an animated open/close icon, keep that animation app-owned through `action.icon`.

### AlertDialog

Use `AlertDialog` for modal confirmation and blocking feedback.

```tsx
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

AlertDialog rules:

- Use React Native `Modal` by default.
- Use React Native `Animated` for default entry/exit animation.
- Keep `animated={false}` available.
- Keep `icon` and `closeIcon` pluggable.
- Wire `onRequestClose` for Android back button.
- Keep backdrop dismiss controlled by `dismissOnBackdropPress`.
- Enable Android `statusBarTranslucent`, `navigationBarTranslucent`, and `hardwareAccelerated` by default so the overlay covers system UI areas more consistently.
- Treat Android navigation bar color as app-owned system UI. Do not import `expo-navigation-bar` in core; document app-level integration instead.
- Do not import portal, navigation, Reanimated, or bottom-sheet dependencies in core.

### Button

Use `Button` for text/icon actions.

```tsx
<Button variant="filled" tone="primary" fullWidth>
  Continue
</Button>

<Button variant="outline" tone="secondary">
  Cancel
</Button>
```

With generic icon render function:

```tsx
<Button
  leftIcon={({ color, size }) => (
    <Icon name="add" color={color} size={size} />
  )}
>
  Create
</Button>
```

### IconButton

Use `IconButton` for icon-only actions.

```tsx
<IconButton
  icon={({ color, size }) => <Icon name="settings" color={color} size={size} />}
  variant="outline"
/>
```

### Badge

Use `Badge` for status labels and compact metadata.

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="danger" variant="outline">Failed</Badge>
```

### Card

Use `Card` for flat bordered surfaces.

```tsx
<Card>
  <Text variant="title">Card title</Text>
  <Text color="textMuted">Card content.</Text>
</Card>
```

### Divider

Use `Divider` for token-based separators.

```tsx
<Divider />
<Divider vertical />
```

### AspectRatio

Use `AspectRatio` to maintain aspect ratios of media and other layouts. Children will stretch to fill the container automatically.

```tsx
<AspectRatio ratio={16 / 9} radius="md">
  <Image source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' }} style={{ resizeMode: 'cover' }} />
</AspectRatio>
```

### Attachment

Use `Attachment` to show uploaded or uploading files. Supports `card` and `row` layouts.

```tsx
<Attachment
  layout="card"
  name="workspace.png"
  description="PNG • 820 KB"
  thumbnail="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
  onRemove={() => console.log('Remove')}
/>

<Attachment
  layout="row"
  name="sales-dashboard.pdf"
  description="Uploading • 64%"
  loading
  onRemove={() => console.log('Remove')}
/>
```

## Logging Rules

- The library should not force logging.
- Apps can implement their own debug/error helpers around persistence or integration code.
- Success logs should be debug-only and dev-only.
- Storage failures should be logged as errors in app code because they affect user preferences.

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

## Documentation Rules

- Update `README.md` for every public API or behavior change.
- Update this `RULES.md` when structure, conventions, component list, or maintenance rules change.
- Keep usage examples simple and copy-pasteable.
- Mention whether a feature is library-core or app-owned.

## Verification Checklist

Before finishing changes:

- Run `bun run --filter @masumdev/rn-ui build`.
- Run the native app TypeScript check when app integration changes:

```sh
node node_modules/.bun/typescript@5.9.2/node_modules/typescript/lib/tsc.js -p apps/native/tsconfig.json --noEmit
```

- Confirm `README.md` is updated for user-facing changes.
- Confirm `RULES.md` is updated for structure or convention changes.
- Confirm `apps/native/app/rn-ui.tsx` includes a sample for every public component.
