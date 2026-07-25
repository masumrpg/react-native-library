import React from "react";
import {
  Switch as RNSwitch,
  type StyleProp,
  type SwitchProps as RNSwitchProps,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";

export interface SwitchProps extends Omit<
  RNSwitchProps,
  "trackColor" | "thumbColor"
> {
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Switch({
  value = false,
  disabled = false,
  invalid = false,
  style,
  ...props
}: SwitchProps) {
  const { colors } = useTheme();
  const activeColor = invalid ? colors.danger : colors.primary;

  return (
    <RNSwitch
      value={value}
      disabled={disabled}
      trackColor={{
        false: colors.backgroundSubtle,
        true: activeColor,
      }}
      thumbColor={disabled ? colors.disabledText : colors.surface}
      ios_backgroundColor={colors.backgroundSubtle}
      style={style}
      {...props}
    />
  );
}
