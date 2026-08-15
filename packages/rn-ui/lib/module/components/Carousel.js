"use strict";

import React from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useTheme } from "../theme/index.js";
import { renderIcon } from "./types.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const {
  width: SCREEN_WIDTH
} = Dimensions.get("window");
const CarouselContext = /*#__PURE__*/React.createContext(null);
export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
export function Carousel({
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
  } = useTheme();
  const [containerWidth, setContainerWidth] = React.useState(SCREEN_WIDTH);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);
  const scrollX = useSharedValue(0);
  const scrollViewRef = React.useRef(null);
  const resolvedItemWidth = itemWidth || containerWidth * 0.78;
  const scrollPrev = React.useCallback(() => {
    const nextIndex = Math.max(0, activeIndex - 1);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, resolvedItemWidth]);
  const scrollNext = React.useCallback(() => {
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
  React.useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);
  return /*#__PURE__*/_jsx(CarouselContext.Provider, {
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
    children: /*#__PURE__*/_jsxs(View, {
      onLayout: handleLayout,
      style: [{
        width: "100%",
        position: "relative"
      }, style],
      ...props,
      children: [children, showPagination && totalItems > 1 && /*#__PURE__*/_jsx(View, {
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
          return /*#__PURE__*/_jsx(View, {
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
export function CarouselContent({
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
  const [containerWidth, setContainerWidth] = React.useState(SCREEN_WIDTH);
  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;
  React.useEffect(() => {
    setTotalItems(total);
  }, [total, setTotalItems]);
  const updateActiveIndex = React.useCallback(index => {
    setActiveIndex(prev => {
      if (prev !== index) {
        return index;
      }
      return prev;
    });
  }, [setActiveIndex]);
  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / itemWidth);
      if (index >= 0 && index < total) {
        runOnJS(updateActiveIndex)(index);
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
    if (/*#__PURE__*/React.isValidElement(child)) {
      return /*#__PURE__*/React.cloneElement(child, {
        index
      });
    }
    return child;
  });
  return /*#__PURE__*/_jsx(View, {
    onLayout: handleLayout,
    style: {
      width: "100%",
      overflow: "hidden"
    },
    children: /*#__PURE__*/_jsx(Animated.ScrollView, {
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
export function CarouselItem({
  index = 0,
  style,
  children,
  ...props
}) {
  const {
    scrollX,
    itemWidth
  } = useCarousel();
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth];
    return {
      opacity: interpolate(scrollX.value, inputRange, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [{
        scale: interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolation.CLAMP)
      }]
    };
  });
  return /*#__PURE__*/_jsx(Animated.View, {
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
  return /*#__PURE__*/_jsx(View, {
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
  return /*#__PURE__*/_jsx(View, {
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
export function CarouselPrevious({
  style,
  icon
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const {
    scrollPrev,
    canScrollPrev
  } = useCarousel();
  if (!canScrollPrev) return null;
  return /*#__PURE__*/_jsx(Pressable, {
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
    children: icon ? renderIcon(icon, colors.text, 18) : /*#__PURE__*/_jsx(ChevronLeftIcon, {
      color: colors.text
    })
  });
}
export function CarouselNext({
  style,
  icon
}) {
  const {
    colors,
    components,
    radii,
    spacing
  } = useTheme();
  const {
    scrollNext,
    canScrollNext
  } = useCarousel();
  if (!canScrollNext) return null;
  return /*#__PURE__*/_jsx(Pressable, {
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
    children: icon ? renderIcon(icon, colors.text, 18) : /*#__PURE__*/_jsx(ChevronRightIcon, {
      color: colors.text
    })
  });
}
//# sourceMappingURL=Carousel.js.map