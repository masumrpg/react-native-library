"use strict";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const AvatarContext = /*#__PURE__*/createContext(null);
function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("Avatar components must be rendered within an Avatar provider");
  }
  return context;
}
const GroupContext = /*#__PURE__*/createContext(null);
export function Avatar({
  size = "default",
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if rendered inside an AvatarGroup
  const group = useContext(GroupContext);
  const finalSize = group ? group.size : size;
  const inGroup = !!group;

  // Determine width and height based on size
  const dimension = finalSize === "lg" ? 40 : finalSize === "sm" ? 24 : 32;
  const rootStyle = {
    position: "relative",
    width: dimension,
    height: dimension,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    // Let the badge sit outside or on the edge
    ...(inGroup ? {
      borderWidth: components.borderWidth.ring,
      borderColor: colors.background // ring-2 ring-background
    } : {})
  };
  return /*#__PURE__*/_jsx(AvatarContext.Provider, {
    value: {
      size: finalSize,
      hasLoaded,
      setHasLoaded,
      hasError,
      setHasError,
      inGroup
    },
    children: /*#__PURE__*/_jsx(View, {
      style: [rootStyle, style],
      ...props,
      children: children
    })
  });
}
export function AvatarImage({
  source,
  style,
  onLoad,
  onError,
  ...props
}) {
  const {
    setHasLoaded,
    setHasError,
    hasError
  } = useAvatarContext();
  const {
    radii
  } = useTheme();
  useEffect(() => {
    setHasLoaded(false);
    setHasError(false);
  }, [source]);
  if (hasError) {
    return null;
  }
  const handleLoad = e => {
    setHasLoaded(true);
    onLoad?.(e);
  };
  const handleError = e => {
    setHasError(true);
    onError?.(e);
  };
  return /*#__PURE__*/_jsx(Image, {
    source: source,
    style: [StyleSheet.absoluteFill, {
      borderRadius: radii.full
    }, style],
    onLoad: handleLoad,
    onError: handleError,
    ...props
  });
}
export function AvatarFallback({
  style,
  textStyle,
  children,
  ...props
}) {
  const {
    hasLoaded,
    hasError,
    size
  } = useAvatarContext();
  const {
    colors,
    radii
  } = useTheme();

  // Show fallback only if not loaded yet OR if load failed
  if (hasLoaded && !hasError) {
    return null;
  }
  const fallbackStyle = {
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center"
  };

  // Determine text size based on size
  const fontSize = size === "lg" ? 16 : size === "sm" ? 10 : 12;
  return /*#__PURE__*/_jsx(View, {
    style: [StyleSheet.absoluteFill, fallbackStyle, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/_jsx(Text, {
      style: [{
        color: colors.textMuted,
        fontSize,
        fontWeight: "600"
      }, textStyle],
      children: children
    }) : children
  });
}
export function AvatarBadge({
  style,
  bg,
  ...props
}) {
  const {
    size
  } = useAvatarContext();
  const {
    colors,
    components
  } = useTheme();

  // Determine badge dimensions based on parent size
  const badgeSize = size === "lg" ? 12 : size === "sm" ? 8 : 10;
  const offset = size === "lg" ? 0 : size === "sm" ? -1 : -0.5;
  const badgeStyle = {
    position: "absolute",
    right: offset,
    bottom: offset,
    width: badgeSize,
    height: badgeSize,
    borderRadius: badgeSize / 2,
    backgroundColor: bg || colors.primary,
    borderWidth: components.borderWidth.focus,
    borderColor: colors.background,
    // ring-2 ring-background
    zIndex: 10
  };
  return /*#__PURE__*/_jsx(View, {
    style: [badgeStyle, style],
    ...props
  });
}
export function AvatarGroup({
  size = "default",
  style,
  children,
  ...props
}) {
  const groupStyle = {
    flexDirection: "row",
    alignItems: "center"
  };

  // Spacing values mapped to negative margins
  const spacing = size === "lg" ? -10 : size === "sm" ? -6 : -8;
  return /*#__PURE__*/_jsx(GroupContext.Provider, {
    value: {
      inGroup: true,
      size
    },
    children: /*#__PURE__*/_jsx(View, {
      style: [groupStyle, style],
      ...props,
      children: React.Children.map(children, (child, index) => {
        if (! /*#__PURE__*/React.isValidElement(child)) return child;
        return /*#__PURE__*/React.cloneElement(child, {
          style: [{
            marginLeft: index === 0 ? 0 : spacing
          }, child.props.style]
        });
      })
    })
  });
}
export function AvatarGroupCount({
  count,
  style,
  textStyle,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = useTheme();
  const group = useContext(GroupContext);
  const size = group ? group.size : "default";
  const dimension = size === "lg" ? 40 : size === "sm" ? 24 : 32;
  const spacing = size === "lg" ? -10 : size === "sm" ? -6 : -8;
  const fontSize = size === "lg" ? 14 : size === "sm" ? 10 : 12;
  const countStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: components.borderWidth.ring,
    borderColor: colors.background,
    // ring-2 ring-background
    marginLeft: spacing
  };
  return /*#__PURE__*/_jsx(View, {
    style: [countStyle, style],
    ...props,
    children: /*#__PURE__*/_jsxs(Text, {
      style: [{
        color: colors.textMuted,
        fontSize,
        fontWeight: "600"
      }, textStyle],
      children: ["+", count]
    })
  });
}
//# sourceMappingURL=Avatar.js.map