"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputGroup = InputGroup;
exports.InputGroupAddon = InputGroupAddon;
exports.InputGroupButton = InputGroupButton;
exports.InputGroupInput = void 0;
exports.InputGroupText = InputGroupText;
exports.InputGroupTextarea = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _theme = require("../theme");
var _utils = require("../utils");
var _Button = require("./Button");
var _Input = require("./Input");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const InputGroupContext = /*#__PURE__*/_react.default.createContext(null);
function useInputGroupContext() {
  return _react.default.useContext(InputGroupContext);
}
function InputGroup({
  orientation = "inline",
  invalid = false,
  disabled = false,
  style,
  children,
  ...props
}) {
  const {
    colors,
    radii
  } = (0, _theme.useTheme)();
  const [focused, setFocused] = _react.default.useState(false);
  const [controlState, setControlState] = _react.default.useState({
    invalid: false,
    disabled: false
  });
  const isInvalid = invalid || controlState.invalid;
  const isDisabled = disabled || controlState.disabled;
  const borderColor = isInvalid ? colors.danger : focused ? colors.primary : colors.border;
  const value = _react.default.useMemo(() => ({
    focused,
    orientation,
    invalid: isInvalid,
    disabled: isDisabled,
    setFocused,
    setControlState: state => {
      setControlState(current => ({
        invalid: state.invalid ?? current.invalid,
        disabled: state.disabled ?? current.disabled
      }));
    }
  }), [focused, isDisabled, isInvalid, orientation]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(InputGroupContext.Provider, {
    value: value,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      accessibilityState: {
        disabled: isDisabled
      },
      style: [{
        width: "100%",
        minHeight: 44,
        borderRadius: radii.lg,
        borderWidth: focused || isInvalid ? 1.5 : 1.25,
        borderColor,
        backgroundColor: isDisabled ? (0, _utils.withAlpha)(colors.input, 0.55) : colors.input,
        flexDirection: orientation === "block" ? "column" : "row",
        alignItems: orientation === "block" ? "stretch" : "center",
        overflow: "hidden",
        opacity: isDisabled ? 0.72 : 1
      }, style],
      ...props,
      children: children
    })
  });
}
function InputGroupAddon({
  align = "inline-start",
  style,
  children,
  ...props
}) {
  const {
    spacing
  } = (0, _theme.useTheme)();
  const isBlock = align === "block-start" || align === "block-end";
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      width: isBlock ? "100%" : undefined,
      minHeight: isBlock ? undefined : 44,
      paddingHorizontal: isBlock ? spacing.md : spacing.sm,
      paddingVertical: isBlock ? spacing.sm : 0,
      alignItems: isBlock ? "flex-start" : "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.sm
    }, style],
    ...props,
    children: children
  });
}
function InputGroupButton({
  size = "xs",
  variant = "ghost",
  shape,
  children,
  style,
  ...props
}) {
  const {
    radii
  } = (0, _theme.useTheme)();
  const isIcon = size === "icon-xs" || size === "icon-sm";
  const buttonSize = size === "sm" || size === "icon-sm" ? "sm" : "xs";
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.Button, {
    size: buttonSize,
    variant: variant,
    shape: shape ?? (isIcon ? "square" : "rounded"),
    style: [{
      minWidth: isIcon ? size === "icon-sm" ? 32 : 24 : undefined,
      paddingHorizontal: isIcon ? 0 : size === "sm" ? 12 : 10,
      borderRadius: isIcon ? radii.sm : radii.md
    }, style],
    ...props,
    children: children ?? ""
  });
}
function InputGroupText({
  style,
  textStyle,
  children,
  ...props
}) {
  const {
    colors,
    typography,
    spacing
  } = (0, _theme.useTheme)();
  const context = useInputGroupContext();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm
    }, style],
    ...props,
    children: typeof children === "string" || typeof children === "number" ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: [typography.bodySmall, {
        color: context?.disabled ? colors.disabledText : colors.textMuted,
        fontWeight: "500"
      }, textStyle],
      children: children
    }) : children
  });
}
const InputGroupInput = exports.InputGroupInput = /*#__PURE__*/_react.default.forwardRef(function InputGroupInput({
  invalid = false,
  disabled = false,
  editable,
  onFocus,
  onBlur,
  style,
  ...props
}, ref) {
  const context = useInputGroupContext();
  const isEditable = editable ?? !disabled;
  _react.default.useEffect(() => {
    context?.setControlState({
      invalid,
      disabled: !isEditable
    });
  }, [context, invalid, isEditable]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Input.Input, {
    ref: ref,
    invalid: false,
    disabled: !isEditable,
    editable: isEditable,
    fullWidth: false,
    onFocus: event => {
      context?.setFocused(true);
      onFocus?.(event);
    },
    onBlur: event => {
      context?.setFocused(false);
      onBlur?.(event);
    },
    style: [{
      flex: context?.orientation === "block" ? undefined : 1,
      width: context?.orientation === "block" ? "100%" : undefined,
      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: "transparent",
      minHeight: 42
    }, style],
    ...props
  });
});
const InputGroupTextarea = exports.InputGroupTextarea = /*#__PURE__*/_react.default.forwardRef(function InputGroupTextarea({
  style,
  ...props
}, ref) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(InputGroupInput, {
    ref: ref,
    multiline: true,
    textAlignVertical: "top",
    style: [{
      minHeight: 96,
      paddingVertical: 10
    }, style],
    ...props
  });
});
//# sourceMappingURL=InputGroup.js.map