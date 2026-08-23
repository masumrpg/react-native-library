import React from "react";
import {
  Dimensions,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import { useTheme } from "../theme";
import { triggerHaptic } from "../utils/haptics";
import { renderIcon, type RenderIcon } from "./types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface CarouselProps {
  itemWidth?: number;
  onIndexChange?: (index: number) => void;
  showPagination?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CarouselContextProps {
  scrollX: SharedValue<number>;
  itemWidth: number;
  activeIndex: number;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollViewRef: React.RefObject<any>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function CarouselDot({ index }: { index: number }) {
  const { colors } = useTheme();
  const { scrollX, itemWidth, scrollViewRef, setActiveIndex } = useCarousel();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [6, 22, 6],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.35, 1, 0.35],
      Extrapolation.CLAMP,
    );

    return {
      width,
      opacity,
    };
  });

  return (
    <Pressable
      onPress={() => {
        triggerHaptic("selection");
        scrollViewRef.current?.scrollTo({
          x: index * itemWidth,
          animated: true,
        });
        setActiveIndex(index);
      }}
      hitSlop={8}
    >
      <Animated.View
        style={[
          {
            height: 6,
            borderRadius: 999,
            backgroundColor: colors.primary,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

export function Carousel({
  itemWidth,
  onIndexChange,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = true,
  style,
  children,
  ...props
}: CarouselProps) {
  const { spacing } = useTheme();

  const [containerWidth, setContainerWidth] = React.useState(SCREEN_WIDTH);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  const scrollX = useSharedValue(0);
  const scrollViewRef = React.useRef<any>(null);

  const resolvedItemWidth = itemWidth || containerWidth * 0.78;

  const scrollPrev = React.useCallback(() => {
    triggerHaptic("selection");
    const nextIndex = activeIndex > 0 ? activeIndex - 1 : loop ? totalItems - 1 : 0;
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true,
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, loop, resolvedItemWidth, totalItems]);

  const scrollNext = React.useCallback(() => {
    triggerHaptic("selection");
    const nextIndex = activeIndex < totalItems - 1 ? activeIndex + 1 : loop ? 0 : totalItems - 1;
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true,
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, loop, resolvedItemWidth, totalItems]);

  const canScrollPrev = loop || activeIndex > 0;
  const canScrollNext = loop || activeIndex < totalItems - 1;

  // AutoPlay timer
  React.useEffect(() => {
    if (!autoPlay || totalItems <= 1) return;

    const timer = setInterval(() => {
      scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, totalItems, scrollNext]);

  const handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  React.useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  return (
    <CarouselContext.Provider
      value={{
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
        setActiveIndex,
      }}
    >
      <View
        onLayout={handleLayout}
        style={[
          {
            width: "100%",
            position: "relative",
          },
          style,
        ]}
        {...props}
      >
        {children}

        {showPagination && totalItems > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: spacing.md,
              gap: spacing.xs,
            }}
          >
            {Array.from({ length: totalItems }).map((_, i) => (
              <CarouselDot key={i} index={i} />
            ))}
          </View>
        )}
      </View>
    </CarouselContext.Provider>
  );
}

export interface CarouselContentProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function CarouselContent({ style, children }: CarouselContentProps) {
  const { scrollX, itemWidth, scrollViewRef, setTotalItems, setActiveIndex } =
    useCarousel();

  const [containerWidth, setContainerWidth] = React.useState(SCREEN_WIDTH);

  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;

  React.useEffect(() => {
    setTotalItems(total);
  }, [total, setTotalItems]);

  const updateActiveIndex = React.useCallback(
    (index: number) => {
      setActiveIndex((prev) => {
        if (prev !== index) {
          return index;
        }
        return prev;
      });
    },
    [setActiveIndex],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / itemWidth);
      if (index >= 0 && index < total) {
        runOnJS(updateActiveIndex)(index);
      }
    },
  });

  const handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  const sidePadding = Math.max(0, (containerWidth - itemWidth) / 2);

  // Automatically inject index prop into CarouselItem children
  const renderedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        index,
      });
    }
    return child;
  });

  return (
    <View onLayout={handleLayout} style={{ width: "100%", overflow: "hidden" }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={itemWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={[
          {
            paddingHorizontal: sidePadding,
          },
          style,
        ]}
      >
        {renderedChildren}
      </Animated.ScrollView>
    </View>
  );
}

export interface CarouselItemProps {
  index?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function CarouselItem({
  index = 0,
  style,
  children,
  ...props
}: CarouselItemProps) {
  const { scrollX, itemWidth } = useCarousel();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    return {
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.6, 1, 0.6],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.92, 1, 0.92],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          justifyContent: "center",
          alignItems: "center",
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

// Chevron pure arrow icons
function ChevronLeftIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
        marginLeft: 2,
      }}
    />
  );
}

function ChevronRightIcon({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: color,
        transform: [{ rotate: "45deg" }],
        marginRight: 2,
      }}
    />
  );
}

export interface CarouselButtonProps {
  style?: StyleProp<ViewStyle>;
  icon?: RenderIcon;
}

export function CarouselPrevious({ style, icon }: CarouselButtonProps) {
  const { colors, components, radii, spacing } = useTheme();
  const { scrollPrev, canScrollPrev } = useCarousel();

  if (!canScrollPrev) return null;

  return (
    <Pressable
      onPress={scrollPrev}
      style={({ pressed }) => [
        {
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
          opacity: pressed ? 0.78 : 1,
        },
        style,
      ]}
    >
      {icon ? (
        renderIcon(icon, colors.text, 18)
      ) : (
        <ChevronLeftIcon color={colors.text} />
      )}
    </Pressable>
  );
}

export function CarouselNext({ style, icon }: CarouselButtonProps) {
  const { colors, components, radii, spacing } = useTheme();
  const { scrollNext, canScrollNext } = useCarousel();

  if (!canScrollNext) return null;

  return (
    <Pressable
      onPress={scrollNext}
      style={({ pressed }) => [
        {
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
          opacity: pressed ? 0.78 : 1,
        },
        style,
      ]}
    >
      {icon ? (
        renderIcon(icon, colors.text, 18)
      ) : (
        <ChevronRightIcon color={colors.text} />
      )}
    </Pressable>
  );
}
