/**
 * Safe haptic feedback utility for @masumdev/rn-ui.
 * Attempts to invoke expo-haptics if available in runtime, gracefully falling back to a no-op if absent.
 */
export function triggerHaptic(
  type:
    | "light"
    | "medium"
    | "heavy"
    | "soft"
    | "rigid"
    | "selection"
    | "success"
    | "warning"
    | "error" = "light"
) {
  try {
    const Haptic = require("expo-haptics");
    if (!Haptic) return;

    switch (type) {
      case "light":
        Haptic.impactAsync?.(Haptic.ImpactFeedbackStyle?.Light);
        break;
      case "medium":
        Haptic.impactAsync?.(Haptic.ImpactFeedbackStyle?.Medium);
        break;
      case "heavy":
        Haptic.impactAsync?.(Haptic.ImpactFeedbackStyle?.Heavy);
        break;
      case "soft":
        Haptic.impactAsync?.(Haptic.ImpactFeedbackStyle?.Soft ?? Haptic.ImpactFeedbackStyle?.Light);
        break;
      case "rigid":
        Haptic.impactAsync?.(Haptic.ImpactFeedbackStyle?.Rigid ?? Haptic.ImpactFeedbackStyle?.Medium);
        break;
      case "selection":
        Haptic.selectionAsync?.();
        break;
      case "success":
        Haptic.notificationAsync?.(Haptic.NotificationFeedbackType?.Success);
        break;
      case "warning":
        Haptic.notificationAsync?.(Haptic.NotificationFeedbackType?.Warning);
        break;
      case "error":
        Haptic.notificationAsync?.(Haptic.NotificationFeedbackType?.Error);
        break;
    }
  } catch (_err) {
    // Graceful no-op when expo-haptics is absent in pure React Native or mock environments
  }
}
