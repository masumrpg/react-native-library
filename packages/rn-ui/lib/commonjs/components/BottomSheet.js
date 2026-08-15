"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BottomSheet = void 0;
Object.defineProperty(exports, "BottomSheetFlatList", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetFlatList;
  }
});
Object.defineProperty(exports, "BottomSheetModal", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetModal;
  }
});
Object.defineProperty(exports, "BottomSheetModalProvider", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetModalProvider;
  }
});
Object.defineProperty(exports, "BottomSheetScrollView", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetScrollView;
  }
});
Object.defineProperty(exports, "BottomSheetSectionList", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetSectionList;
  }
});
Object.defineProperty(exports, "BottomSheetTextInput", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetTextInput;
  }
});
Object.defineProperty(exports, "BottomSheetView", {
  enumerable: true,
  get: function () {
    return _bottomSheet.BottomSheetView;
  }
});
Object.defineProperty(exports, "useBottomSheet", {
  enumerable: true,
  get: function () {
    return _bottomSheet.useBottomSheet;
  }
});
Object.defineProperty(exports, "useBottomSheetModal", {
  enumerable: true,
  get: function () {
    return _bottomSheet.useBottomSheetModal;
  }
});
var _react = _interopRequireDefault(require("react"));
var _bottomSheet = _interopRequireWildcard(require("@gorhom/bottom-sheet"));
var _theme = require("../theme");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BottomSheet = exports.BottomSheet = /*#__PURE__*/_react.default.forwardRef(function BottomSheet({
  withBackdrop = true,
  backdropOpacity = 0.48,
  backdropAppearsOnIndex = 0,
  backdropDisappearsOnIndex = -1,
  backdropPressBehavior = "close",
  backdropStyle,
  backdropComponent,
  backgroundStyle,
  handleStyle,
  handleIndicatorStyle,
  style,
  children,
  ...props
}, ref) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const themedBackdrop = _react.default.useCallback(backdropProps => /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheet.BottomSheetBackdrop, {
    ...backdropProps,
    appearsOnIndex: backdropAppearsOnIndex,
    disappearsOnIndex: backdropDisappearsOnIndex,
    opacity: backdropOpacity,
    pressBehavior: backdropPressBehavior,
    style: [{
      backgroundColor: colors.overlay
    }, backdropProps.style, backdropStyle]
  }), [backdropAppearsOnIndex, backdropDisappearsOnIndex, backdropOpacity, backdropPressBehavior, backdropStyle, colors.overlay]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_bottomSheet.default, {
    ref: ref,
    backdropComponent: backdropComponent ?? (withBackdrop ? themedBackdrop : undefined),
    backgroundStyle: [{
      backgroundColor: colors.surface,
      borderTopLeftRadius: radii.xxl,
      borderTopRightRadius: radii.xxl,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border
    }, backgroundStyle],
    handleStyle: [{
      paddingTop: spacing.md,
      paddingBottom: spacing.sm
    }, handleStyle],
    handleIndicatorStyle: [{
      width: 40,
      height: 4,
      borderRadius: radii.full,
      backgroundColor: colors.border
    }, handleIndicatorStyle],
    style: [{
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    }, style],
    ...props,
    children: children
  });
});
//# sourceMappingURL=BottomSheet.js.map