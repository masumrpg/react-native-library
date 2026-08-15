"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Carousel = Carousel;
exports.CarouselContent = CarouselContent;
exports.CarouselItem = CarouselItem;
exports.CarouselNext = CarouselNext;
exports.CarouselPrevious = CarouselPrevious;
exports.useCarousel = useCarousel;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _theme = require("../theme");
var _types = require("./types");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  width: SCREEN_WIDTH
} = _reactNative.Dimensions.get("window");
const CarouselContext = /*#__PURE__*/_react.default.createContext(null);
function useCarousel() {
  const context = _react.default.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
function Carousel({
  itemWidth,
  onIndexChange,
  showPagination = true,
  style,
  children,
  ...props
}) {
  const {
    colors,
    spacing
  } = (0, _theme.useTheme)();
  const [containerWidth, setContainerWidth] = _react.default.useState(SCREEN_WIDTH);
  const [activeIndex, setActiveIndex] = _react.default.useState(0);
  const [totalItems, setTotalItems] = _react.default.useState(0);
  const scrollX = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollViewRef = _react.default.useRef(null);
  const resolvedItemWidth = itemWidth || containerWidth * 0.78;
  const scrollPrev = _react.default.useCallback(() => {
    const nextIndex = Math.max(0, activeIndex - 1);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, resolvedItemWidth]);
  const scrollNext = _react.default.useCallback(() => {
    const nextIndex = Math.min(totalItems - 1, activeIndex + 1);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, totalItems, resolvedItemWidth]);
  const canScrollPrev = activeIndex > 0;
  const canScrollNext = activeIndex < totalItems - 1;
  const handleLayout = e => {
    const {
      width
    } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };
  _react.default.useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(CarouselContext.Provider, {
    value: {
      scrollX,
      itemWidth: resolvedItemWidth,
      activeIndex,
      totalItems,
      setTotalItems,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      scrollViewRef,
      setActiveIndex
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      onLayout: handleLayout,
      style: [{
        width: "100%",
        position: "relative"
      }, style],
      ...props,
      children: [children, showPagination && totalItems > 1 && /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: spacing.md,
          gap: spacing.xs
        },
        children: Array.from({
          length: totalItems
        }).map((_, i) => {
          const isActive = activeIndex === i;
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
            style: {
              width: isActive ? 16 : 6,
              height: 6,
              borderRadius: 999,
              backgroundColor: isActive ? colors.primary : colors.border
            }
          }, i);
        })
      })]
    })
  });
}
function CarouselContent({
  style,
  children
}) {
  const {
    scrollX,
    itemWidth,
    scrollViewRef,
    setTotalItems,
    setActiveIndex
  } = useCarousel();
  const [containerWidth, setContainerWidth] = _react.default.useState(SCREEN_WIDTH);
  const childrenArray = _react.default.Children.toArray(children);
  const total = childrenArray.length;
  _react.default.useEffect(() => {
    setTotalItems(total);
  }, [total, setTotalItems]);
  const updateActiveIndex = _react.default.useCallback(index => {
    setActiveIndex(prev => {
      if (prev !== index) {
        return index;
      }
      return prev;
    });
  }, [setActiveIndex]);
  const handleScroll = (0, _reactNativeReanimated.useAnimatedScrollHandler)({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / itemWidth);
      if (index >= 0 && index < total) {
        (0, _reactNativeReanimated.runOnJS)(updateActiveIndex)(index);
      }
    }
  });
  const handleLayout = e => {
    const {
      width
    } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };
  const sidePadding = (containerWidth - itemWidth) / 2;

  // Automatically inject index prop into CarouselItem children
  const renderedChildren = childrenArray.map((child, index) => {
    if (/*#__PURE__*/_react.default.isValidElement(child)) {
      return /*#__PURE__*/_react.default.cloneElement(child, {
        index
      });
    }
    return child;
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    onLayout: handleLayout,
    style: {
      width: "100%",
      overflow: "hidden"
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.ScrollView, {
      ref: scrollViewRef,
      horizontal: true,
      pagingEnabled: false,
      snapToInterval: itemWidth,
      snapToAlignment: "center",
      decelerationRate: "fast",
      showsHorizontalScrollIndicator: false,
      scrollEventThrottle: 16,
      onScroll: handleScroll,
      contentContainerStyle: [{
        paddingHorizontal: sidePadding
      }, style],
      children: renderedChildren
    })
  });
}
function CarouselItem({
  index = 0,
  style,
  children,
  ...props
}) {
  const {
    scrollX,
    itemWidth
  } = useCarousel();
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const inputRange = [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth];
    return {
      opacity: (0, _reactNativeReanimated.interpolate)(scrollX.value, inputRange, [0.55, 1, 0.55], _reactNativeReanimated.Extrapolation.CLAMP),
      transform: [{
        scale: (0, _reactNativeReanimated.interpolate)(scrollX.value, inputRange, [0.9, 1, 0.9], _reactNativeReanimated.Extrapolation.CLAMP)
      }]
    };
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
    style: [{
      width: itemWidth,
      justifyContent: "center",
      alignItems: "center"
    }, animatedStyle, style],
    ...props,
    children: children
  });
}

// Chevron pure arrow icons
function ChevronLeftIcon({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 10,
      height: 10,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginLeft: 2
    }
  });
}
function ChevronRightIcon({
  color
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: {
      width: 10,
      height: 10,
      borderRightWidth: 2,
      borderTopWidth: 2,
      borderColor: color,
      transform: [{
        rotate: "45deg"
      }],
      marginRight: 2
    }
  });
}
function CarouselPrevious({
  style,
  icon
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const {
    scrollPrev,
    canScrollPrev
  } = useCarousel();
  if (!canScrollPrev) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: scrollPrev,
    style: ({
      pressed
    }) => [{
      position: "absolute",
      left: spacing.sm,
      top: "50%",
      marginTop: -32,
      width: 36,
      height: 36,
      borderRadius: radii.full,
      backgroundColor: colors.surface,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      opacity: pressed ? 0.78 : 1
    }, style],
    children: icon ? (0, _types.renderIcon)(icon, colors.text, 18) : /*#__PURE__*/(0, _jsxRuntime.jsx)(ChevronLeftIcon, {
      color: colors.text
    })
  });
}
function CarouselNext({
  style,
  icon
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = (0, _theme.useTheme)();
  const {
    scrollNext,
    canScrollNext
  } = useCarousel();
  if (!canScrollNext) return null;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: scrollNext,
    style: ({
      pressed
    }) => [{
      position: "absolute",
      right: spacing.sm,
      top: "50%",
      marginTop: -32,
      width: 36,
      height: 36,
      borderRadius: radii.full,
      backgroundColor: colors.surface,
      borderWidth: components.borderWidth.strong,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      opacity: pressed ? 0.78 : 1
    }, style],
    children: icon ? (0, _types.renderIcon)(icon, colors.text, 18) : /*#__PURE__*/(0, _jsxRuntime.jsx)(ChevronRightIcon, {
      color: colors.text
    })
  });
}
//# sourceMappingURL=Carousel.js.map