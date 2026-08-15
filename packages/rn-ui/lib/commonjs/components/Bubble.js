"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bubble = Bubble;
exports.BubbleContent = BubbleContent;
exports.BubbleGroup = BubbleGroup;
exports.BubbleReactions = BubbleReactions;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BubbleContext = /*#__PURE__*/(0, _react.createContext)(null);
function useBubbleContext() {
  const context = (0, _react.useContext)(BubbleContext);
  if (!context) {
    throw new Error("Bubble components must be rendered within a Bubble provider");
  }
  return context;
}
function BubbleGroup({
  style,
  children,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const groupStyle = {
    flexDirection: "column",
    gap: spacing.sm,
    // 8px (gap-2)
    width: "100%"
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [groupStyle, style],
    ...props,
    children: children
  });
}
function Bubble({
  variant = "default",
  align = "start",
  style,
  children,
  ...props
}) {
  const bubbleStyle = {
    alignSelf: align === "end" ? "flex-end" : "flex-start",
    maxWidth: variant === "ghost" ? "100%" : "80%",
    position: "relative",
    flexDirection: "column",
    gap: 4 // gap-1
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(BubbleContext.Provider, {
    value: {
      variant,
      align
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [bubbleStyle, style],
      ...props,
      children: children
    })
  });
}
function BubbleContent({
  style,
  textStyle,
  onPress,
  children,
  ...props
}) {
  const {
    variant,
    align
  } = useBubbleContext();
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();

  // Get themed color mapping for variant
  const colorsMap = getVariantColors(variant, colors);
  const containerStyle = {
    paddingHorizontal: spacing.md,
    // px-3 (12px)
    paddingVertical: spacing.sm + 2,
    // py-2.5 (10px)
    borderRadius: radii.xl + 4,
    // rounded-3xl (~20-24px)
    borderWidth: variant === "outline" ? components.borderWidth.default : 0,
    borderColor: colorsMap.border,
    backgroundColor: colorsMap.bg,
    alignSelf: align === "end" ? "flex-end" : "flex-start"
  };
  const isGhost = variant === "ghost";
  const finalContainerStyle = isGhost ? {
    borderWidth: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0
  } : containerStyle;
  if (onPress) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      onPress: onPress,
      style: ({
        pressed
      }) => [finalContainerStyle, {
        opacity: pressed ? 0.8 : 1
      }, style],
      ...props,
      children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
        style: [{
          color: colorsMap.text,
          fontSize: 14,
          lineHeight: 20
        }, textStyle],
        children: children
      }) : children
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [finalContainerStyle, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: [{
        color: colorsMap.text,
        fontSize: 14,
        lineHeight: 20
      }, textStyle],
      children: children
    }) : children
  });
}
function BubbleReactions({
  side = "bottom",
  align = "end",
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const reactionStyle = {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: colors.backgroundMuted,
    borderRadius: radii.full,
    borderWidth: components.borderWidth.focus,
    borderColor: colors.surface,
    // ring-card
    paddingHorizontal: spacing.xs + 2,
    // px-1.5
    paddingVertical: spacing.xxs + 1,
    // py-0.5
    zIndex: 10,
    ...(side === "top" ? {
      top: -12
    } : {
      bottom: -12
    }),
    ...(align === "start" ? {
      left: 12
    } : {
      right: 12
    })
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [reactionStyle, style],
    ...props,
    children: children
  });
}

// Helper to resolve themed background, text, and border colors based on Bubble variant
function getVariantColors(variant, colors) {
  switch (variant) {
    case "secondary":
      return {
        bg: colors.secondarySoft,
        text: colors.text,
        border: "transparent"
      };
    case "muted":
      return {
        bg: colors.backgroundMuted,
        text: colors.textMuted,
        border: "transparent"
      };
    case "tinted":
      return {
        bg: colors.primarySoft,
        text: colors.primary,
        border: "transparent"
      };
    case "outline":
      return {
        bg: colors.background,
        text: colors.text,
        border: colors.border
      };
    case "ghost":
      return {
        bg: "transparent",
        text: colors.text,
        border: "transparent"
      };
    case "destructive":
      return {
        bg: colors.dangerSoft,
        text: colors.danger,
        border: "transparent"
      };
    case "default":
    default:
      return {
        bg: colors.primary,
        text: colors.onPrimary,
        border: "transparent"
      };
  }
}
//# sourceMappingURL=Bubble.js.map