# Animation Guidelines: Zero-Bounce Policy

## Mandatory Rules for UI Components

1. **No Bouncy Springs (`withSpring` with overshoot/low damping)**:
   - Interactive UI controls (Sliders, RangeSliders, RadioGroups, Checkboxes, Switches, Tabs, Selects, Comboboxes, Modals, Drawers) must **NEVER** bounce, wobble, or overshoot.
2. **Direct Tracking or Smooth Timing**:
   - For gesture-driven components (Sliders, Drag handlers): sync progress values directly (`progress.value = nextProgress`) without lag.
   - For state transitions (checked, active, pressed): use `withTiming(target, { duration: 100-160 })` with smooth ease curve.
