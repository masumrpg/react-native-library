"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Avatar = Avatar;
exports.AvatarBadge = AvatarBadge;
exports.AvatarFallback = AvatarFallback;
exports.AvatarGroup = AvatarGroup;
exports.AvatarGroupCount = AvatarGroupCount;
exports.AvatarImage = AvatarImage;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AvatarContext = /*#__PURE__*/(0, _react.createContext)(null);
function useAvatarContext() {
  const context = (0, _react.useContext)(AvatarContext);
  if (!context) {
    throw new Error("Avatar components must be rendered within an Avatar provider");
  }
  return context;
}
const GroupContext = /*#__PURE__*/(0, _react.createContext)(null);
function Avatar({
  size = "default",
  style,
  children,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();
  const [hasLoaded, setHasLoaded] = (0, _react.useState)(false);
  const [hasError, setHasError] = (0, _react.useState)(false);

  // Check if rendered inside an AvatarGroup
  const group = (0, _react.useContext)(GroupContext);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AvatarContext.Provider, {
    value: {
      size: finalSize,
      hasLoaded,
      setHasLoaded,
      hasError,
      setHasError,
      inGroup
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [rootStyle, style],
      ...props,
      children: children
    })
  });
}
function AvatarImage({
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
  } = (0, _theme.useTheme)();
  (0, _react.useEffect)(() => {
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Image, {
    source: source,
    style: [_reactNative.StyleSheet.absoluteFill, {
      borderRadius: radii.full
    }, style],
    onLoad: handleLoad,
    onError: handleError,
    ...props
  });
}
function AvatarFallback({
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
  } = (0, _theme.useTheme)();

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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [_reactNative.StyleSheet.absoluteFill, fallbackStyle, style],
    ...props,
    children: typeof children === "string" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: [{
        color: colors.textMuted,
        fontSize,
        fontWeight: "600"
      }, textStyle],
      children: children
    }) : children
  });
}
function AvatarBadge({
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
  } = (0, _theme.useTheme)();

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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [badgeStyle, style],
    ...props
  });
}
function AvatarGroup({
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(GroupContext.Provider, {
    value: {
      inGroup: true,
      size
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: [groupStyle, style],
      ...props,
      children: _react.default.Children.map(children, (child, index) => {
        if (! /*#__PURE__*/_react.default.isValidElement(child)) return child;
        return /*#__PURE__*/_react.default.cloneElement(child, {
          style: [{
            marginLeft: index === 0 ? 0 : spacing
          }, child.props.style]
        });
      })
    })
  });
}
function AvatarGroupCount({
  count,
  style,
  textStyle,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();
  const group = (0, _react.useContext)(GroupContext);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [countStyle, style],
    ...props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Text.Text, {
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