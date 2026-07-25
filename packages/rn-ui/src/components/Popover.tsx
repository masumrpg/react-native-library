import React from "react";
import {
  Modal,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const currentOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <PopoverContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends PressableProps {
  triggerMode?: "press" | "longPress";
}

export function PopoverTrigger({
  triggerMode = "press",
  onPress,
  onLongPress,
  ...props
}: PopoverTriggerProps) {
  const context = React.useContext(PopoverContext);
  return (
    <Pressable
      onPress={(event) => {
        if (triggerMode === "press") context?.setOpen(true);
        onPress?.(event);
      }}
      onLongPress={(event) => {
        if (triggerMode === "longPress") context?.setOpen(true);
        onLongPress?.(event);
      }}
      {...props}
    />
  );
}

export interface PopoverContentProps {
  children?: React.ReactNode;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export function PopoverContent({
  children,
  width = 280,
  style,
}: PopoverContentProps) {
  const context = React.useContext(PopoverContext);
  const { colors, components, radii, spacing } = useTheme();
  if (!context) return null;
  return (
    <Modal
      visible={context.open}
      transparent
      animationType="fade"
      onRequestClose={() => context.setOpen(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xl,
        }}
        onPress={() => context.setOpen(false)}
      >
        <Pressable
          style={[
            {
              width,
              maxWidth: "100%",
              borderRadius: radii.xl,
              borderWidth: components.borderWidth.strong,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              padding: spacing.lg,
            },
            style,
          ]}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
