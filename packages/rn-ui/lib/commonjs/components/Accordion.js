"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accordion = Accordion;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function renderIndicator(indicator, expanded, color, size) {
  if (typeof indicator === "function") {
    return indicator({
      expanded,
      color,
      size
    });
  }
  if (indicator) {
    return indicator;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
    style: {
      color,
      fontSize: size,
      lineHeight: size,
      fontWeight: "700"
    },
    children: expanded ? "-" : "+"
  });
}
function DefaultAccordionContent({
  expanded,
  children,
  duration,
  style
}) {
  const progress = (0, _reactNativeReanimated.useSharedValue)(expanded ? 1 : 0);
  const [contentHeight, setContentHeight] = (0, _react.useState)(0);
  const [shouldRender, setShouldRender] = (0, _react.useState)(expanded);
  (0, _react.useEffect)(() => {
    if (expanded) {
      setShouldRender(true);
    }
    progress.value = (0, _reactNativeReanimated.withTiming)(expanded ? 1 : 0, {
      duration
    }, finished => {
      if (finished && !expanded) {
        (0, _reactNativeReanimated.runOnJS)(setShouldRender)(false);
      }
    });
  }, [duration, expanded, progress]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value
  }));
  if (!shouldRender && !expanded) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: [{
      overflow: "hidden"
    }, animatedStyle],
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [style, {
        position: "absolute",
        left: 0,
        right: 0
      }],
      onLayout: event => {
        setContentHeight(event.nativeEvent.layout.height);
      },
      children: children
    })
  });
}
function DefaultAccordionIndicator({
  expanded,
  children,
  duration,
  style
}) {
  const progress = (0, _reactNativeReanimated.useSharedValue)(expanded ? 1 : 0);
  (0, _react.useEffect)(() => {
    progress.value = (0, _reactNativeReanimated.withTiming)(expanded ? 1 : 0, {
      duration
    });
  }, [duration, expanded, progress]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      rotate: `${progress.value * 180}deg`
    }]
  }));
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: [style, animatedStyle],
    children: children
  });
}
function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  openIds,
  onOpenChange,
  disabled = false,
  animated = true,
  animationDuration = 180,
  animationComponents,
  indicator,
  itemStyle,
  headerStyle,
  titleStyle,
  subtitleStyle,
  contentStyle,
  style
}) {
  const {
    colors,
    components,
    radii,
    spacing,
    typography
  } = (0, _theme.useTheme)();
  const [internalOpenIds, setInternalOpenIds] = (0, _react.useState)(defaultOpenIds);
  const activeOpenIds = openIds ?? internalOpenIds;
  const openSet = (0, _react.useMemo)(() => new Set(activeOpenIds), [activeOpenIds]);
  const setNextOpenIds = (0, _react.useCallback)(nextOpenIds => {
    if (!openIds) {
      setInternalOpenIds(nextOpenIds);
    }
    onOpenChange?.(nextOpenIds);
  }, [onOpenChange, openIds]);
  const AnimatedContent = animationComponents?.Content ?? DefaultAccordionContent;
  const AnimatedIndicator = animationComponents?.Indicator ?? DefaultAccordionIndicator;
  const toggleItem = (0, _react.useCallback)(item => {
    if (disabled || item.disabled) return;
    const expanded = openSet.has(item.id);
    const nextOpenIds = expanded ? activeOpenIds.filter(id => id !== item.id) : allowMultiple ? [...activeOpenIds, item.id] : [item.id];
    setNextOpenIds(nextOpenIds);
  }, [activeOpenIds, allowMultiple, disabled, openSet, setNextOpenIds]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      gap: spacing.sm
    }, style],
    children: items.map(item => {
      const expanded = openSet.has(item.id);
      const itemDisabled = disabled || item.disabled;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: [{
          backgroundColor: colors.surface,
          borderRadius: radii.xl,
          borderWidth: components.borderWidth.strong,
          borderColor: expanded ? colors.primary : colors.border,
          overflow: "hidden",
          opacity: itemDisabled ? 0.58 : 1
        }, itemStyle],
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
          accessibilityRole: "button",
          accessibilityState: {
            expanded,
            disabled: itemDisabled
          },
          disabled: itemDisabled,
          onPress: () => toggleItem(item),
          style: ({
            pressed
          }) => [{
            padding: spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            backgroundColor: pressed && !itemDisabled ? colors.backgroundMuted : colors.surface
          }, headerStyle],
          children: [(0, _types.renderIcon)(item.icon, expanded ? colors.primary : colors.textMuted, 20), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
            style: {
              flex: 1,
              gap: spacing.xxs
            },
            children: [typeof item.title === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: [typography.subtitle, {
                color: expanded ? colors.primary : colors.text
              }, titleStyle],
              children: item.title
            }) : item.title, typeof item.subtitle === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: [typography.bodySmall, {
                color: colors.textMuted
              }, subtitleStyle],
              children: item.subtitle
            }) : item.subtitle]
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: {
              width: 24,
              height: 24,
              alignItems: "center",
              justifyContent: "center"
            },
            children: animated ? /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedIndicator, {
              expanded: expanded,
              duration: animationDuration,
              children: renderIndicator(indicator, expanded, expanded ? colors.primary : colors.textMuted, 18)
            }) : renderIndicator(indicator, expanded, expanded ? colors.primary : colors.textMuted, 18)
          })]
        }), animated ? /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedContent, {
          expanded: expanded,
          duration: animationDuration,
          style: [{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: spacing.lg,
            backgroundColor: colors.surface
          }, contentStyle],
          children: typeof item.content === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: [typography.body, {
              color: colors.textMuted
            }],
            children: item.content
          }) : item.content
        }) : expanded && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: [{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: spacing.lg,
            backgroundColor: colors.surface
          }, contentStyle],
          children: typeof item.content === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: [typography.body, {
              color: colors.textMuted
            }],
            children: item.content
          }) : item.content
        })]
      }, item.id);
    })
  });
}
//# sourceMappingURL=Accordion.js.map