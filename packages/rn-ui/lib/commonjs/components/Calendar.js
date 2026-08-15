"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Calendar = Calendar;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeCalendars = require("react-native-calendars");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _Text = require("./Text");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORTS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Pure component chevrons to avoid external icon dependencies
function ChevronLeft({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 8,
      height: 8,
      borderLeftWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginRight: -2
    }
  });
}
function ChevronRight({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 8,
      height: 8,
      borderRightWidth: 1.5,
      borderTopWidth: 1.5,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginLeft: -2
    }
  });
}
function CalendarDayButton({
  date,
  state,
  marking = {},
  onPress,
  onLongPress
}) {
  const {
    colors,
    radii
  } = (0, _theme.useTheme)();
  const isSelected = marking.selected || state === "selected";
  const isStart = marking.startingDay;
  const isEnd = marking.endingDay;
  const isMiddle = marking.isMiddle;
  const isToday = state === "today";
  const isDisabled = state === "disabled" || marking.disabled;
  const cellStyle = {
    aspectRatio: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1
  };
  let bg = "transparent";
  let textColor = colors.text;
  let borderTopLeftRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomRightRadius = 0;
  if (isStart) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopLeftRadius = radii.md;
    borderBottomLeftRadius = radii.md;
  } else if (isEnd) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopRightRadius = radii.md;
    borderBottomRightRadius = radii.md;
  } else if (isMiddle) {
    bg = colors.backgroundMuted;
    textColor = colors.primary;
  } else if (isSelected) {
    bg = colors.primary;
    textColor = colors.onPrimary;
    borderTopLeftRadius = radii.full;
    borderBottomLeftRadius = radii.full;
    borderTopRightRadius = radii.full;
    borderBottomRightRadius = radii.full;
  } else if (isToday) {
    bg = colors.backgroundMuted;
    textColor = colors.text;
    borderTopLeftRadius = radii.full;
    borderBottomLeftRadius = radii.full;
    borderTopRightRadius = radii.full;
    borderBottomRightRadius = radii.full;
  }
  if (isDisabled) {
    textColor = colors.disabledText;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: () => !isDisabled && onPress && onPress(date),
    onLongPress: () => !isDisabled && onLongPress && onLongPress(date),
    style: ({
      pressed
    }) => [cellStyle, {
      backgroundColor: bg,
      borderTopLeftRadius,
      borderBottomLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      opacity: pressed && !isDisabled ? 0.78 : 1
    }],
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
      style: {
        color: textColor,
        fontSize: 14,
        fontWeight: isSelected || isToday ? "600" : "400"
      },
      children: date.day
    })
  });
}
function Calendar({
  style,
  theme,
  markingType = "period",
  markedDates,
  current,
  enableYearMonthPicker = true,
  ...props
}) {
  const {
    colors,
    components,
    radii
  } = (0, _theme.useTheme)();

  // Parsing initial month/year
  const initialDate = current ? new Date(current) : new Date();
  const [currentMonth, setCurrentMonth] = _react.default.useState(initialDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = _react.default.useState(initialDate.getFullYear());
  const [showMonthSelector, setShowMonthSelector] = _react.default.useState(false);
  const [showYearSelector, setShowYearSelector] = _react.default.useState(false);
  const [overlayHeight, setOverlayHeight] = _react.default.useState(260);
  const [calendarKey, setCalendarKey] = _react.default.useState(0);
  const monthProgress = (0, _reactNativeReanimated.useSharedValue)(showMonthSelector ? 1 : 0);
  const yearProgress = (0, _reactNativeReanimated.useSharedValue)(showYearSelector ? 1 : 0);
  _react.default.useEffect(() => {
    monthProgress.value = (0, _reactNativeReanimated.withSpring)(showMonthSelector ? 1 : 0, {
      damping: 16,
      stiffness: 180
    });
  }, [monthProgress, showMonthSelector]);
  _react.default.useEffect(() => {
    yearProgress.value = (0, _reactNativeReanimated.withSpring)(showYearSelector ? 1 : 0, {
      damping: 16,
      stiffness: 180
    });
  }, [showYearSelector, yearProgress]);
  const monthOverlayStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: monthProgress.value,
    transform: [{
      translateY: -600 * (1 - monthProgress.value)
    }]
  }));
  const yearOverlayStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    opacity: yearProgress.value,
    transform: [{
      translateY: -600 * (1 - yearProgress.value)
    }]
  }));

  // Sync visible date when controlled 'current' prop changes
  _react.default.useEffect(() => {
    if (current) {
      const d = new Date(current);
      if (!isNaN(d.getTime())) {
        setCurrentMonth(d.getMonth() + 1);
        setCurrentYear(d.getFullYear());
        setCalendarKey(prev => prev + 1);
      }
    }
  }, [current]);
  const visibleMonthStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setCalendarKey(prev => prev + 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCalendarKey(prev => prev + 1);
  };
  const handleMonthChange = dateData => {
    setCurrentMonth(dateData.month);
    setCurrentYear(dateData.year);
    if (props.onMonthChange) {
      props.onMonthChange(dateData);
    }
  };
  const customTheme = {
    calendarBackground: colors.surface,
    monthTextColor: colors.text,
    textMonthFontWeight: "600",
    textMonthFontSize: 16,
    textSectionTitleColor: colors.textMuted,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500",
    arrowColor: colors.text,
    disabledArrowColor: colors.disabledText,
    ...theme
  };

  // Generate years: from 100 years ago to 10 years ahead
  const endYear = new Date().getFullYear() + 5;
  const startYear = endYear - 100;
  const years = Array.from({
    length: endYear - startYear + 1
  }, (_, i) => endYear - i);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [{
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      overflow: "hidden",
      position: "relative"
    }, style],
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: handlePrevMonth,
        style: ({
          pressed
        }) => ({
          padding: 8,
          borderRadius: radii.md,
          backgroundColor: pressed ? colors.backgroundMuted : colors.transparent
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ChevronLeft, {
          color: colors.text
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          flexDirection: "row",
          gap: 6,
          alignItems: "center"
        },
        children: enableYearMonthPicker ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
            onPress: () => {
              setShowMonthSelector(!showMonthSelector);
              setShowYearSelector(false);
            },
            style: ({
              pressed
            }) => ({
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: radii.md,
              backgroundColor: showMonthSelector ? colors.backgroundMuted : pressed ? colors.backgroundMuted : colors.transparent
            }),
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
              style: {
                fontSize: 15,
                fontWeight: "600",
                color: colors.text
              },
              children: MONTHS[currentMonth - 1]
            })
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
            onPress: () => {
              setShowYearSelector(!showYearSelector);
              setShowMonthSelector(false);
            },
            style: ({
              pressed
            }) => ({
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: radii.md,
              backgroundColor: showYearSelector ? colors.backgroundMuted : pressed ? colors.backgroundMuted : colors.transparent
            }),
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
              style: {
                fontSize: 15,
                fontWeight: "600",
                color: colors.text
              },
              children: currentYear
            })
          })]
        }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Text.Text, {
          style: {
            fontSize: 15,
            fontWeight: "600",
            color: colors.text
          },
          children: [MONTHS[currentMonth - 1], " ", currentYear]
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: handleNextMonth,
        style: ({
          pressed
        }) => ({
          padding: 8,
          borderRadius: radii.md,
          backgroundColor: pressed ? colors.backgroundMuted : colors.transparent
        }),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ChevronRight, {
          color: colors.text
        })
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      pointerEvents: showMonthSelector ? "auto" : "none",
      style: [{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.surface,
        zIndex: 30,
        padding: 16,
        justifyContent: "center"
      }, monthOverlayStyle],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center"
        },
        children: MONTH_SHORTS.map((m, idx) => {
          const isSel = currentMonth === idx + 1;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
            onPress: () => {
              setCurrentMonth(idx + 1);
              setShowMonthSelector(false);
              setCalendarKey(prev => prev + 1);
            },
            style: ({
              pressed
            }) => ({
              width: "30%",
              margin: 4,
              paddingVertical: 12,
              borderRadius: radii.md,
              backgroundColor: isSel ? colors.primary : colors.transparent,
              borderWidth: components.borderWidth.strong,
              borderColor: isSel ? colors.primary : colors.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.78 : 1
            }),
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
              style: {
                fontSize: 14,
                fontWeight: isSel ? "600" : "400",
                color: isSel ? colors.onPrimary : colors.text
              },
              children: m
            })
          }, m);
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      pointerEvents: showYearSelector ? "auto" : "none",
      onLayout: e => {
        const {
          height
        } = e.nativeEvent.layout;
        if (height > 0) {
          setOverlayHeight(height);
        }
      },
      style: [{
        position: "absolute",
        top: 52,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.surface,
        zIndex: 30,
        padding: 8,
        justifyContent: "center",
        alignItems: "center"
      }, yearOverlayStyle],
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        style: {
          width: "100%",
          height: "100%"
        },
        contentContainerStyle: {
          flexDirection: "column",
          flexWrap: "wrap",
          height: overlayHeight - 24,
          paddingHorizontal: 8,
          paddingVertical: 12
        },
        children: years.map(y => {
          const isSel = currentYear === y;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
            onPress: () => {
              setCurrentYear(y);
              setShowYearSelector(false);
              setCalendarKey(prev => prev + 1);
            },
            style: ({
              pressed
            }) => ({
              width: 75,
              height: 42,
              margin: 4,
              borderRadius: radii.md,
              backgroundColor: isSel ? colors.primary : colors.transparent,
              borderWidth: components.borderWidth.strong,
              borderColor: isSel ? colors.primary : colors.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.78 : 1
            }),
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Text.Text, {
              style: {
                fontSize: 13,
                fontWeight: isSel ? "600" : "400",
                color: isSel ? colors.onPrimary : colors.text
              },
              children: y
            })
          }, y);
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeCalendars.Calendar, {
      style: {
        padding: 8
      },
      theme: customTheme,
      markingType: markingType,
      markedDates: markedDates,
      hideArrows: true,
      renderHeader: () => null,
      current: visibleMonthStr,
      onMonthChange: handleMonthChange,
      dayComponent: ({
        date,
        state,
        marking,
        onPress,
        onLongPress
      }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(CalendarDayButton, {
        date: date,
        state: state,
        marking: marking,
        onPress: onPress,
        onLongPress: onLongPress
      }),
      ...props
    }, `wix-cal-${calendarKey}`)]
  });
}
//# sourceMappingURL=Calendar.js.map