"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sheet = void 0;
Object.defineProperty(exports, "SheetContent", {
  enumerable: true,
  get: function () {
    return _BottomSheet.BottomSheetView;
  }
});
exports.SheetDescription = SheetDescription;
exports.SheetFooter = SheetFooter;
exports.SheetHeader = SheetHeader;
exports.SheetTitle = SheetTitle;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _BottomSheet = require("./BottomSheet");
var _Text = require("./Text");
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Sheet = exports.Sheet = /*#__PURE__*/_react.default.forwardRef(function Sheet({
  index = -1,
  animateOnMount = false,
  ...props
}, ref) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BottomSheet.BottomSheet, {
    ref: ref,
    index: index,
    animateOnMount: animateOnMount,
    enablePanDownToClose: true,
    ...props
  });
});
function SheetHeader({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      gap: spacing.xs
    }, style],
    ...props
  });
}
function SheetTitle({
  children,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "title",
    color: "text",
    style: style,
    children: children
  });
}
function SheetDescription({
  children,
  style
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
    variant: "bodySmall",
    color: "textMuted",
    style: style,
    children: children
  });
}
function SheetFooter({
  style,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: spacing.sm
    }, style],
    ...props
  });
}
//# sourceMappingURL=Sheet.js.map