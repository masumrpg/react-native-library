import React from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme";
import { renderIcon, type RenderIcon } from "./types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface CarouselProps {
  itemWidth?: number;
  onIndexChange?: (index: number) => void;
  showPagination?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CarouselContextProps {
  scrollX: Animated.Value;
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

export function Carousel({
  itemWidth,
  onIndexChange,
  showPagination = true,
  style,
  children,
  ...props
}: CarouselProps) {
  const { colors, spacing } = useTheme();

  const [containerWidth, setContainerWidth] = React.useState(SCREEN_WIDTH);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [totalItems, setTotalItems] = React.useState(0);

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<any>(null);

  const resolvedItemWidth = itemWidth || containerWidth * 0.78;

  const scrollPrev = React.useCallback(() => {
    const nextIndex = Math.max(0, activeIndex - 1);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true,
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, resolvedItemWidth]);

  const scrollNext = React.useCallback(() => {
    const nextIndex = Math.min(totalItems - 1, activeIndex + 1);
    scrollViewRef.current?.scrollTo({
      x: nextIndex * resolvedItemWidth,
      animated: true,
    });
    setActiveIndex(nextIndex);
  }, [activeIndex, totalItems, resolvedItemWidth]);

  const canScrollPrev = activeIndex > 0;
  const canScrollNext = activeIndex < totalItems - 1;

  const handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

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
            {Array.from({ length: totalItems }).map((_, i) => {
              const isActive = activeIndex === i;
              return (
                <View
                  key={i}
                  style={{
                    width: isActive ? 16 : 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: isActive ? colors.primary : colors.border,
                  }}
                />
              );
            })}
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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e: any) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / itemWidth);
        if (index >= 0 && index < total) {
          setActiveIndex((prev) => {
            if (prev !== index) {
              return index;
            }
            return prev;
          });
        }
      },
    },
  );

  const handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  const sidePadding = (containerWidth - itemWidth) / 2;

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

  const scale = scrollX.interpolate({
    inputRange: [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ],
    outputRange: [0.9, 1, 0.9],
    extrapolate: "clamp",
  });

  const opacity = scrollX.interpolate({
    inputRange: [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ],
    outputRange: [0.55, 1, 0.55],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        {
          width: itemWidth,
          opacity,
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "center",
        },
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
  const { colors, radii, spacing } = useTheme();
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
          borderWidth: 1.25,
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
  const { colors, radii, spacing } = useTheme();
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
          borderWidth: 1.25,
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
