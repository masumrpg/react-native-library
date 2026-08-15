"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Attachment = Attachment;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _types = require("./types");
var _AspectRatio = require("./AspectRatio");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Attachment({
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
  } = (0, _theme.useTheme)();
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
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
      children: closeIcon ? (0, _types.renderIcon)(closeIcon, colors.textMuted, size) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
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
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: [styles.thumbnailPlaceholder, {
          backgroundColor: colors.backgroundMuted,
          width: containerSize,
          height: containerSize,
          borderRadius: radii.md
        }],
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
          size: "small",
          color: colors.textMuted
        })
      });
    }
    if (typeof thumbnail === "string") {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: containerSize,
          height: containerSize,
          overflow: "hidden",
          borderRadius: radii.md
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
          source: {
            uri: thumbnail
          },
          style: _reactNative.StyleSheet.absoluteFill,
          resizeMode: "cover"
        })
      });
    }
    if (thumbnail) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: [styles.thumbnailPlaceholder, {
          backgroundColor: colors.backgroundMuted,
          width: containerSize,
          height: containerSize,
          borderRadius: radii.md
        }],
        children: (0, _types.renderIcon)(thumbnail, colors.textMuted, containerSize * 0.5)
      });
    }

    // Default file icon fallback
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [styles.thumbnailPlaceholder, {
        backgroundColor: colors.backgroundMuted,
        width: containerSize,
        height: containerSize,
        borderRadius: radii.md
      }],
      children: fileIcon ? (0, _types.renderIcon)(fileIcon, colors.textMuted, containerSize * 0.5) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
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
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
      disabled: !onPress,
      onPress: onPress,
      style: ({
        pressed
      }) => [cardStyle, {
        opacity: pressed ? 0.8 : 1
      }, style],
      ...props,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AspectRatio.AspectRatio, {
        ratio: 1,
        radius: "md",
        children: renderThumbnail(104)
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.textContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
          variant: "labelSmall",
          numberOfLines: 1,
          ellipsizeMode: "tail",
          style: [{
            color: colors.text
          }, nameStyle],
          children: name
        }), description && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
    disabled: !onPress,
    onPress: onPress,
    style: ({
      pressed
    }) => [rowStyle, {
      opacity: pressed ? 0.85 : 1
    }, style],
    ...props,
    children: [renderThumbnail(40), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [styles.textContainer, {
        flex: 1
      }],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        variant: "label",
        numberOfLines: 1,
        ellipsizeMode: "tail",
        style: [{
          color: colors.text
        }, nameStyle],
        children: name
      }), description && /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
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
const styles = _reactNative.StyleSheet.create({
  thumbnailPlaceholder: {
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    justifyContent: "center"
  }
});
//# sourceMappingURL=Attachment.js.map