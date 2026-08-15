"use strict";

import React from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme/index.js";
import { Text } from "./Text.js";
import { renderIcon } from "./types.js";
import { AspectRatio } from "./AspectRatio.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Attachment({
  layout = "row",
  name,
  description,
  thumbnail,
  loading = false,
  onRemove,
  closeIcon,
  fileIcon,
  descriptionTone = "default",
  onPress,
  style,
  nameStyle,
  descriptionStyle,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const descriptionColorByTone = {
    default: "textMuted",
    info: "info",
    success: "success",
    warning: "warning",
    danger: "danger"
  };
  const descColor = colors[descriptionColorByTone[descriptionTone]];

  // Render close/remove button
  const renderRemoveButton = size => {
    if (!onRemove) return null;
    return /*#__PURE__*/_jsx(Pressable, {
      accessibilityRole: "button",
      accessibilityLabel: "Remove attachment",
      onPress: onRemove,
      style: ({
        pressed
      }) => ({
        padding: spacing.xxs,
        opacity: pressed ? 0.6 : 1,
        justifyContent: "center",
        alignItems: "center"
      }),
      children: closeIcon ? renderIcon(closeIcon, colors.textMuted, size) : /*#__PURE__*/_jsx(Text, {
        variant: "bodySmall",
        style: {
          color: colors.textMuted,
          fontWeight: "600"
        },
        children: "\xD7"
      })
    });
  };

  // Render thumbnail content (Image, Icon, or Spinner)
  const renderThumbnail = containerSize => {
    if (loading) {
      return /*#__PURE__*/_jsx(View, {
        style: [styles.thumbnailPlaceholder, {
          backgroundColor: colors.backgroundMuted,
          width: containerSize,
          height: containerSize,
          borderRadius: radii.md
        }],
        children: /*#__PURE__*/_jsx(ActivityIndicator, {
          size: "small",
          color: colors.textMuted
        })
      });
    }
    if (typeof thumbnail === "string") {
      return /*#__PURE__*/_jsx(View, {
        style: {
          width: containerSize,
          height: containerSize,
          overflow: "hidden",
          borderRadius: radii.md
        },
        children: /*#__PURE__*/_jsx(Image, {
          source: {
            uri: thumbnail
          },
          style: StyleSheet.absoluteFill,
          resizeMode: "cover"
        })
      });
    }
    if (thumbnail) {
      return /*#__PURE__*/_jsx(View, {
        style: [styles.thumbnailPlaceholder, {
          backgroundColor: colors.backgroundMuted,
          width: containerSize,
          height: containerSize,
          borderRadius: radii.md
        }],
        children: renderIcon(thumbnail, colors.textMuted, containerSize * 0.5)
      });
    }

    // Default file icon fallback
    return /*#__PURE__*/_jsx(View, {
      style: [styles.thumbnailPlaceholder, {
        backgroundColor: colors.backgroundMuted,
        width: containerSize,
        height: containerSize,
        borderRadius: radii.md
      }],
      children: fileIcon ? renderIcon(fileIcon, colors.textMuted, containerSize * 0.5) : /*#__PURE__*/_jsx(View, {
        style: {
          width: containerSize * 0.42,
          height: containerSize * 0.52,
          borderWidth: components.borderWidth.focus,
          borderColor: colors.textMuted,
          borderRadius: radii.xs
        }
      })
    });
  };
  if (layout === "card") {
    // Card Layout (usually fixed width preview, e.g. for grid views)
    const cardStyle = {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: components.borderWidth.strong,
      borderRadius: radii.xl,
      padding: spacing.sm,
      width: 120,
      gap: spacing.xs
    };
    return /*#__PURE__*/_jsxs(Pressable, {
      disabled: !onPress,
      onPress: onPress,
      style: ({
        pressed
      }) => [cardStyle, {
        opacity: pressed ? 0.8 : 1
      }, style],
      ...props,
      children: [/*#__PURE__*/_jsx(AspectRatio, {
        ratio: 1,
        radius: "md",
        children: renderThumbnail(104)
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.textContainer,
        children: [/*#__PURE__*/_jsx(Text, {
          variant: "labelSmall",
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [{
            color: colors.text
          }, nameStyle],
          children: name
        }), description && /*#__PURE__*/_jsx(Text, {
          variant: "caption",
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [{
            color: descColor
          }, descriptionStyle],
          children: description
        })]
      })]
    });
  }

  // Default Row Layout
  const rowStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: components.borderWidth.strong,
    borderRadius: radii.xl,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  };
  return /*#__PURE__*/_jsxs(Pressable, {
    disabled: !onPress,
    onPress: onPress,
    style: ({
      pressed
    }) => [rowStyle, {
      opacity: pressed ? 0.85 : 1
    }, style],
    ...props,
    children: [renderThumbnail(40), /*#__PURE__*/_jsxs(View, {
      style: [styles.textContainer, {
        flex: 1
      }],
      children: [/*#__PURE__*/_jsx(Text, {
        variant: "label",
        numberOfLines: 1,
        ellipsizeMode: "tail",
        style: [{
          color: colors.text
        }, nameStyle],
        children: name
      }), description && /*#__PURE__*/_jsx(Text, {
        variant: "bodySmall",
        numberOfLines: 1,
        ellipsizeMode: "tail",
        style: [{
          color: descColor
        }, descriptionStyle],
        children: description
      })]
    }), renderRemoveButton(16)]
  });
}
const styles = StyleSheet.create({
  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    justifyContent: "center"
  }
});
//# sourceMappingURL=Attachment.js.map