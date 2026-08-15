"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timeline = Timeline;
exports.TimelineDescription = TimelineDescription;
exports.TimelineItem = TimelineItem;
exports.TimelineTitle = TimelineTitle;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function Timeline({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      gap: spacing.md
    }, style],
    ...props
  });
}
function TimelineItem({
  active = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    spacing
  } = (0, _theme.useTheme)();
  const indicatorSize = components.timeline.indicatorSize;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      gap: spacing.md
    }, style],
    ...props,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        alignItems: "center"
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: indicatorSize / 2,
          backgroundColor: active ? colors.primary : colors.border
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          width: components.timeline.connectorWidth,
          flex: 1,
          minHeight: components.timeline.connectorMinHeight,
          backgroundColor: colors.borderMuted
        }
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: {
        flex: 1,
        gap: spacing.xs
      },
      children: children
    })]
  });
}
function TimelineTitle({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "label",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
function TimelineDescription({
  children
}) {
  return typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
    children: children
  });
}
//# sourceMappingURL=Timeline.js.map